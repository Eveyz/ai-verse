mod llm;
mod rag;

use tauri::{State, Manager};
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::rag::RagSystem;
use crate::llm::LLMBackend;

// FIX: Wrap RagSystem directly in Mutex to allow mutable access if needed
struct AppState {
    rag: Mutex<RagSystem>,
    llm: LLMBackend,
}

#[tauri::command]
async fn add_file_to_kb(state: State<'_, Arc<AppState>>, path: String) -> Result<String, String> {
    
    let content = tokio::fs::read_to_string(&path)
        .await
        .map_err(|e| format!("Failed to read file: {}", e))?;

    // Lock the RAG system to get mutable access safely
    let mut rag = state.rag.lock().await;
    rag.add_document(&content)
        .await
        .map_err(|e| e.to_string())?;

    Ok(format!("Successfully indexed: {}", path))
}

#[tauri::command]
async fn chat_with_rag(state: State<'_, Arc<AppState>>, message: String) -> Result<String, String> {
    // Lock logic remains the same
    let mut rag = state.rag.lock().await;

    let context = rag.search(&message, 3)
        .await
        .map_err(|e| e.to_string())?;

    let context_text = context.join("\n---\n");
    let system_prompt = format!("Answer using this context:\n{}", context_text);

    // LLM is immutable (REST call), so we can access it directly if we didn't lock the whole struct
    // But since AppState is shared, we usually just access fields.
    let response = state.llm.generate(&system_prompt, &message)
        .await
        .map_err(|e| e.to_string())?;

    Ok(response)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            tauri::async_runtime::block_on(async {
                let rag = RagSystem::init().await.expect("Failed to init RAG");
                let llm = LLMBackend::new_ollama("llama3");

                // Note: We wrap the WHOLE state in Arc, but RAG is inside a Mutex
                app.manage(Arc::new(AppState {
                    rag: Mutex::new(rag),
                    llm,
                }));
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![add_file_to_kb, chat_with_rag])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}