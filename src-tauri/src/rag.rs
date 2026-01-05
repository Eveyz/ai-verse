use anyhow::Result;
use arrow_array::Array;
use arrow_array::{
    FixedSizeListArray, Float32Array, RecordBatch, RecordBatchIterator, StringArray,
};
use arrow_schema::{DataType, Field, Schema};
use fastembed::{EmbeddingModel, InitOptions, TextEmbedding};
use futures::TryStreamExt;
use lancedb::connection::Connection;
use lancedb::query::{ExecutableQuery, QueryBase};
use lancedb::{connect, Table};
use std::sync::Arc;
use text_splitter::TextSplitter;

pub struct RagSystem {
    embed_model: TextEmbedding,
    db: Connection,
}

impl RagSystem {
    pub async fn init() -> Result<Self> {
        let embed_model = TextEmbedding::try_new(
            InitOptions::new(EmbeddingModel::AllMiniLML6V2).with_show_download_progress(true),
        )?;

        let data_dir = dirs::data_local_dir()
            .ok_or(anyhow::anyhow!("No data dir found"))?
            .join("my-rag-app");
        std::fs::create_dir_all(&data_dir)?;

        let db = connect(data_dir.to_str().unwrap()).execute().await?;

        Ok(Self { embed_model, db })
    }

    async fn get_table(&self, name: &str) -> Result<Table> {
        let table_names = self.db.table_names().execute().await?;

        if table_names.contains(&name.to_string()) {
            Ok(self.db.open_table(name).execute().await?)
        } else {
            let schema = Arc::new(Schema::new(vec![
                Field::new("id", DataType::Utf8, false),
                Field::new("text", DataType::Utf8, false),
                Field::new(
                    "vector",
                    DataType::FixedSizeList(
                        Arc::new(Field::new("item", DataType::Float32, true)),
                        384,
                    ),
                    true,
                ),
            ]));

            Ok(self
                .db
                .create_table(name, RecordBatchIterator::new(vec![], schema.clone()))
                .execute()
                .await?)
        }
    }

    // FIX: Changed &self to &mut self
    pub async fn add_document(&mut self, content: &str) -> Result<()> {
        let splitter = TextSplitter::new(1000);
        let chunks: Vec<&str> = splitter.chunks(content).collect();
        if chunks.is_empty() {
            return Ok(());
        }

        let embeddings = self.embed_model.embed(chunks.clone(), None)?;

        let total_chunks = chunks.len();
        let ids: Vec<String> = (0..total_chunks)
            .map(|_| ulid::Ulid::new().to_string())
            .collect();

        let flat_vectors: Vec<f32> = embeddings.into_iter().flatten().collect();
        let values = Arc::new(Float32Array::from(flat_vectors));

        let vector_array = Arc::new(FixedSizeListArray::try_new(
            Arc::new(Field::new("item", DataType::Float32, true)),
            384,
            values,
            None,
        )?);

        let schema = Arc::new(Schema::new(vec![
            Field::new("id", DataType::Utf8, false),
            Field::new("text", DataType::Utf8, false),
            Field::new(
                "vector",
                DataType::FixedSizeList(Arc::new(Field::new("item", DataType::Float32, true)), 384),
                true,
            ),
        ]));

        let batch = RecordBatch::try_new(
            schema.clone(),
            vec![
                Arc::new(StringArray::from(ids)),
                Arc::new(StringArray::from(
                    chunks
                        .into_iter()
                        .map(String::from)
                        .collect::<Vec<String>>(),
                )),
                vector_array,
            ],
        )?;

        let table = self.get_table("documents").await?;
        table
            .add(Box::new(RecordBatchIterator::new(vec![Ok(batch)], schema)))
            .execute()
            .await?;

        Ok(())
    }

    // FIX: Changed &self to &mut self
    pub async fn search(&mut self, query: &str, limit: usize) -> Result<Vec<String>> {
        let query_embedding = self.embed_model.embed(vec![query], None)?;
        let query_vec = query_embedding[0].clone();

        let table = self.get_table("documents").await?;

        let results = table
            .query()
            .nearest_to(query_vec)?
            .limit(limit)
            .execute()
            .await?;

        let batches: Vec<RecordBatch> = results.try_collect().await?;
        let mut context_chunks = Vec::new();

        for batch in batches {
            let text_col = batch
                .column_by_name("text")
                .ok_or(anyhow::anyhow!("Col missing"))?;
            let text_array = text_col.as_any().downcast_ref::<StringArray>().unwrap();

            for i in 0..text_array.len() {
                context_chunks.push(text_array.value(i).to_string());
            }
        }

        Ok(context_chunks)
    }
}
