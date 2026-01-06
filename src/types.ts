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
export type Theme = 'light' | 'dark' | 'system';

export interface Node {
  id: string;
  label: string;
  type: 'concept' | 'file' | 'person' | 'function';
  val: number; // radius
  sourceId: string; // The data source this node belongs to
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

// Updated Timeline Types
export type TimelineScope = 'global' | 'concept' | 'file';

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'emergence' | 'refinement' | 'contradiction' | 'milestone';
  scope: TimelineScope; // New field
  targetId?: string; // If scope is file/concept, which one?
  title: string;
  description: string;
  relatedFiles: string[];
  diffSummary?: {
    before: string;
    after: string;
  };
}

// --- Data Source Types ---

export type SourceType = 'folder' | 'upload';

export interface DataSource {
  id: string;
  name: string;
  path: string; // absolute path or 'internal://uploads'
  type: SourceType;
  itemCount: number;
  status: 'synced' | 'indexing' | 'error' | 'paused';
  lastSynced: string;
}

export interface LibraryFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'md' | 'code' | 'img' | 'sheet';
  lastModified: string; // ISO date
  semanticTag: string; // AI generated tag
  sourceId: string; // Link to DataSource
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