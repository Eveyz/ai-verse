export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  FINDER = 'FINDER',
  LIBRARY = 'LIBRARY',
  GRAPH = 'GRAPH',
  TIMELINE = 'TIMELINE',
  AGENT = 'AGENT',
  SETTINGS = 'SETTINGS'
}

export type Language = 'en' | 'zh';

export interface Node {
  id: string;
  label: string;
  type: 'concept' | 'file' | 'person' | 'function';
  val: number; // radius
}

export interface Link {
  source: string;
  target: string;
  value: number; // thickness/strength
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  path: string;
  score: number;
  type: 'doc' | 'code' | 'pdf';
  lastModified: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  artifacts?: {
    title: string;
    type: 'markdown' | 'code';
    content: string;
  }[];
  sources?: SearchResult[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'emergence' | 'refinement' | 'contradiction' | 'milestone';
  title: string;
  description: string;
  relatedFiles: string[];
  diffSummary?: {
    before: string;
    after: string;
  };
}

export interface LibraryFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'md' | 'code' | 'img' | 'sheet';
  lastModified: string; // ISO date
  semanticTag: string; // AI generated tag
}

// --- New Model Types ---

export type ComputeMode = 'local' | 'cloud';
export type LocalProvider = 'native' | 'ollama' | 'lmstudio';
export type ModelStatus = 'not_downloaded' | 'downloading' | 'downloaded' | 'active';

export interface AIModel {
  id: string;
  name: string;
  provider: 'Local' | 'Google' | 'OpenAI' | 'Mistral' | 'Ollama';
  family: 'LLM' | 'Embedding' | 'Vision';
  description: string;
  size?: string; // Only for local models
  paramCount?: string; // e.g. "7B"
  status: ModelStatus;
  downloadProgress?: number; // 0-100
  requiresKey?: boolean;
}

export interface UserSubscription {
  status: 'active' | 'expired' | 'none';
  plan: 'pro' | 'enterprise';
  expiryDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscription: UserSubscription;
}
