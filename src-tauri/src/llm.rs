// src-tauri/src/llm.rs
use anyhow::Result;
use serde_json::json;

// FIX: Use Enum instead of Trait for easier State management
#[derive(Clone)]
pub enum LLMBackend {
    Ollama { base_url: String, model: String },
    // You can add Gemini later:
    // Gemini { api_key: String }
}

impl LLMBackend {
    pub fn new_ollama(model: &str) -> Self {
        Self::Ollama {
            base_url: "http://localhost:11434".to_string(),
            model: model.to_string(),
        }
    }

    pub async fn generate(&self, system: &str, prompt: &str) -> Result<String> {
        match self {
            LLMBackend::Ollama { base_url, model } => {
                let client = reqwest::Client::new();
                let url = format!("{}/api/generate", base_url);

                let res = client
                    .post(url)
                    .json(&json!({
                        "model": model,
                        "prompt": format!("System: {}\nUser: {}", system, prompt),
                        "stream": false
                    }))
                    .send()
                    .await?
                    .json::<serde_json::Value>()
                    .await?;

                let text = res["response"]
                    .as_str()
                    .ok_or_else(|| anyhow::anyhow!("Invalid response"))?
                    .to_string();

                Ok(text)
            }
        }
    }
}
