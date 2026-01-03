import { GraphData, SearchResult, TimelineEvent, LibraryFile, AIModel, UserSubscription, User } from './types';

export const MOCK_GRAPH_DATA: GraphData = {
  nodes: [
    { id: 'RAG', label: 'RAG Architecture', type: 'concept', val: 20 },
    { id: 'Embeddings', label: 'Vector Embeddings', type: 'concept', val: 15 },
    { id: 'Transformer', label: 'Transformer Models', type: 'concept', val: 12 },
    { id: 'LocalLLM', label: 'Local LLM Inference', type: 'concept', val: 15 },
    { id: 'main.rs', label: 'main.rs', type: 'file', val: 10 },
    { id: 'indexer.rs', label: 'indexer.rs', type: 'file', val: 10 },
    { id: 'ProjectSpecs', label: 'ProjectSpecs.pdf', type: 'file', val: 12 },
    { id: 'MeetingNotes', label: '2023-10-12 Meeting', type: 'file', val: 8 },
    { id: 'Alice', label: 'Alice (Architect)', type: 'person', val: 12 },
    { id: 'Bob', label: 'Bob (Dev)', type: 'person', val: 12 },
    { id: 'Optimization', label: 'Optimization Strategy', type: 'concept', val: 14 },
  ],
  links: [
    { source: 'RAG', target: 'Embeddings', value: 2 },
    { source: 'RAG', target: 'LocalLLM', value: 3 },
    { source: 'Embeddings', target: 'indexer.rs', value: 5 },
    { source: 'LocalLLM', target: 'main.rs', value: 4 },
    { source: 'Alice', target: 'ProjectSpecs', value: 2 },
    { source: 'Bob', target: 'indexer.rs', value: 3 },
    { source: 'ProjectSpecs', target: 'RAG', value: 1 },
    { source: 'MeetingNotes', target: 'Optimization', value: 1 },
    { source: 'Optimization', target: 'indexer.rs', value: 2 },
    { source: 'Transformer', target: 'LocalLLM', value: 2 },
  ]
};

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: '1',
    title: 'System Architecture v2.0',
    snippet: 'The ...hybrid index approach... combines keyword search with vector embeddings to ensure precise retrieval.',
    path: '/docs/architecture/v2.md',
    score: 0.98,
    type: 'doc',
    lastModified: '2 days ago'
  },
  {
    id: '2',
    title: 'Latency Optimization Plan',
    snippet: 'We need to move the ...embedding generation... to a background thread to avoid blocking the UI.',
    path: '/notes/optimization.txt',
    score: 0.85,
    type: 'doc',
    lastModified: '1 week ago'
  },
  {
    id: '3',
    title: 'fn generate_embeddings',
    snippet: 'pub fn generate_embeddings(text: &str) -> Result<Vec<f32>> { ... }',
    path: '/src/ai/embeddings.rs',
    score: 0.76,
    type: 'code',
    lastModified: '3 weeks ago'
  }
];

export const MOCK_TIMELINE_DATA: TimelineEvent[] = [
  {
    id: '1',
    date: '2023-10-25',
    type: 'milestone',
    title: 'Architecture v2.0 Finalized',
    description: 'The core indexing strategy shifted from pure Vector to Hybrid (Vector + BM25).',
    relatedFiles: ['architecture_v2.md', 'meeting_notes_oct.txt'],
    diffSummary: {
      before: "Index: HNSW only",
      after: "Index: HNSW + Tantivy (BM25)"
    }
  },
  {
    id: '2',
    date: '2023-10-18',
    type: 'refinement',
    title: 'Latency Definition Updated',
    description: 'Re-defined "acceptable latency" for local embedding generation based on user feedback.',
    relatedFiles: ['optimization.txt'],
    diffSummary: {
      before: "< 500ms per chunk",
      after: "< 100ms per chunk (Main Thread Free)"
    }
  },
  {
    id: '3',
    date: '2023-10-10',
    type: 'emergence',
    title: 'Concept Emergence: "Graph RAG"',
    description: 'First mentions of Graph RAG appeared in your research notes. You downloaded 3 papers related to this topic.',
    relatedFiles: ['research/graph_rag_survey.pdf', 'ideas/future_roadmap.md']
  },
  {
    id: '4',
    date: '2023-09-28',
    type: 'contradiction',
    title: 'Conflicting Requirements Detected',
    description: 'The prompt template in `prompts.rs` contradicts the guidelines in `style_guide.md`.',
    relatedFiles: ['src/ai/prompts.rs', 'docs/style_guide.md']
  }
];

export const MOCK_LIBRARY_FILES: LibraryFile[] = [
  { id: '1', name: 'main.rs', size: '12KB', type: 'code', lastModified: '2023-10-27', semanticTag: 'Core Logic' },
  { id: '2', name: 'architecture_v2.md', size: '45KB', type: 'md', lastModified: '2023-10-25', semanticTag: 'Architecture' },
  { id: '3', name: 'meeting_notes_oct.txt', size: '5KB', type: 'md', lastModified: '2023-10-25', semanticTag: 'Planning' },
  { id: '4', name: 'indexer.rs', size: '28KB', type: 'code', lastModified: '2023-10-20', semanticTag: 'Core Logic' },
  { id: '5', name: 'optimization.txt', size: '15KB', type: 'md', lastModified: '2023-10-18', semanticTag: 'Performance' },
  { id: '6', name: 'graph_rag_survey.pdf', size: '2.4MB', type: 'pdf', lastModified: '2023-10-10', semanticTag: 'Research' },
  { id: '7', name: 'future_roadmap.md', size: '12KB', type: 'md', lastModified: '2023-10-10', semanticTag: 'Planning' },
  { id: '8', name: 'budget_Q4.xlsx', size: '150KB', type: 'sheet', lastModified: '2023-09-15', semanticTag: 'Finance' },
  { id: '9', name: 'logo_assets.zip', size: '50MB', type: 'img', lastModified: '2023-09-01', semanticTag: 'Assets' },
  { id: '10', name: 'api_schema.json', size: '8KB', type: 'code', lastModified: '2023-10-22', semanticTag: 'Architecture' },
  { id: '11', name: 'benchmark_results.csv', size: '2MB', type: 'sheet', lastModified: '2023-10-18', semanticTag: 'Performance' },
];

export const MOCK_MODELS: AIModel[] = [
  // Local Models
  { id: 'l1', name: 'Llama 3 8B', provider: 'Local', family: 'LLM', description: 'Balanced performance and speed. Good for general reasoning.', size: '4.7 GB', paramCount: '8B', status: 'active', requiresKey: false },
  { id: 'l2', name: 'Mistral 7B', provider: 'Local', family: 'LLM', description: 'High speed, lower memory footprint.', size: '4.1 GB', paramCount: '7B', status: 'not_downloaded', requiresKey: false },
  { id: 'l3', name: 'Phi-3 Mini', provider: 'Local', family: 'LLM', description: 'Extremely lightweight, runs on almost anything.', size: '2.3 GB', paramCount: '3.8B', status: 'downloaded', requiresKey: false },
  { id: 'e1', name: 'all-MiniLM-L6-v2', provider: 'Local', family: 'Embedding', description: 'Standard local embedding model. Fast.', size: '80 MB', status: 'active', requiresKey: false },
  { id: 'e2', name: 'nomic-embed-text', provider: 'Local', family: 'Embedding', description: 'High quality embeddings with larger context window.', size: '275 MB', status: 'not_downloaded', requiresKey: false },
  
  // Cloud Models
  { id: 'c1', name: 'Gemini 2.5 Flash', provider: 'Google', family: 'LLM', description: 'Low latency, high throughput via API.', status: 'active', requiresKey: true },
  { id: 'c2', name: 'Gemini 2.5 Pro', provider: 'Google', family: 'LLM', description: 'Complex reasoning tasks via API.', status: 'active', requiresKey: true },
  { id: 'c3', name: 'GPT-4o', provider: 'OpenAI', family: 'LLM', description: 'SOTA performance.', status: 'active', requiresKey: true },
  { id: 'ce1', name: 'text-embedding-004', provider: 'Google', family: 'Embedding', description: 'Google native embeddings.', status: 'active', requiresKey: true },
];

// Start with expired to demonstrate UI features
export const MOCK_USER_SUBSCRIPTION: UserSubscription = {
  status: 'expired',
  plan: 'pro',
  expiryDate: '2023-10-01',
};

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Developer',
  email: 'alex@nexus.ai',
  avatar: 'AD',
  subscription: MOCK_USER_SUBSCRIPTION
};
