use anyhow::Result;
use async_trait::async_trait;
use serde_json::json;

/// The common interface for ANY AI provider (Ollama, Gemini, OpenAI)
#[async_trait]
pub trait LLMBackend: Send + Sync {
    async fn generate(&self, system: &str, prompt: &str) -> Result<String>;
}

/// Implementation for Local Ollama
pub struct Ollama {
    pub base_url: String,
    pub model: String,
}

impl Ollama {
    pub fn new(model: &str) -> Self {
        Self {
            base_url: "http://localhost:11434".to_string(),
            model: model.to_string(),
        }
    }
}

#[async_trait]
impl LLMBackend for Ollama {
    async fn generate(&self, system: &str, prompt: &str) -> Result<String> {
        let client = reqwest::Client::new();
        let url = format!("{}/api/generate", self.base_url);

        let res = client.post(url)
            .json(&json!({
                "model": self.model,
                "prompt": format!("System: {}\nUser: {}", system, prompt),
                "stream": false
            }))
            .send()
            .await?
            .json::<serde_json::Value>()
            .await?;

        // Extract 'response' field from Ollama JSON
        let text = res["response"]
            .as_str()
            .ok_or_else(|| anyhow::anyhow!("Invalid response from Ollama"))?
            .to_string();

        Ok(text)
    }
}