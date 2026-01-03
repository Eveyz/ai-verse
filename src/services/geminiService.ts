import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize properly with environment variable
// Note: In this demo UI, we will simulate responses if no key is present,
// to ensure the UI can be reviewed without a key.
// const apiKey = process.env.API_KEY || 'DEMO_KEY';
const apiKey = 'DEMO_KEY';
const ai = new GoogleGenAI({ apiKey });

export const generateSynthesizedResponse = async (
  query: string,
  context: string
): Promise<string> => {
  if (apiKey === 'DEMO_KEY') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`## Analysis of Local Knowledge Base

Based on your local files, here is a synthesis regarding "**${query}**":

### 1. Key Concepts Identified
- **Hybrid Indexing**: Found in \`architecture_v2.md\`. We are currently combining BM25 with cosine similarity.
- **Latency Bottlenecks**: Referenced in \`optimization.txt\`. The main thread is blocking during embedding generation.

### 2. Actionable Recommendations
- Move the tokenizer to a WebWorker (Suggested by Bob in Slack export).
- Refactor \`embeddings.rs\` line 45 to batch inputs.

### 3. Draft snippet
\`\`\`rust
// Proposed fix for async embedding
async fn spawn_embedding_task(text: String) {
    tokio::spawn(async move {
        // ...
    });
}
\`\`\`
`);
      }, 1500);
    });
  }

  try {
    const model = 'gemini-2.5-flash-preview';
    const prompt = `
      You are a "Knowledge OS" assistant running locally. 
      Synthesize the following retrieved context to answer the user's query.
      Focus on connecting dots between different files.
      
      Context: ${context}
      
      User Query: ${query}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error", error);
    return "Error generating response. Please check API Key.";
  }
};
