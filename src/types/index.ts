// Message Types
export type MessageRole = 'user' | 'agent';

export type MessageType = 'text' | 'loading';

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

/**
 * Thinking process for tracking all subagent execution
 * (Similar to Google Gemini's "Thoughts" panel)
 */
export interface ThinkingProcess {
  content: string; // Accumulated text from all subagents
  status: 'in_progress' | 'completed';
  startTime: Date;
  endTime?: Date;
}

export interface MessageArtifact {
  artifactId: string;
  artifactType: string;
  messageId?: string;
  data?: Record<string, unknown> | null;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: Date;
  attachments?: FileAttachment[];
  thinkingProcess?: ThinkingProcess;
  artifact?: MessageArtifact;
  metadata?: {
    isStreaming?: boolean;
    messageId?: string;
    [key: string]: unknown;
  };
}

// Conversation Types
export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  isActive: boolean;
  messageCount: number;
}

// Form Types
export type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'currency' | 'file' | 'number' | 'email';

export type ValidationRule = {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'custom';
  value?: string | number;
  message: string;
};

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  validationRules?: ValidationRule[];
  options?: SelectOption[]; // For select fields
  autoFilled?: boolean; // Indicates if extracted from document
  currencySymbol?: string; // For currency fields
  currencyCode?: string; // For currency fields
  accept?: string; // For file upload fields
  maxSize?: number; // For file upload fields in bytes
}

export interface FormData {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface FormValues {
  [key: string]: string | number | File | undefined;
}

// Document Review Types
export interface BoundingBox {
  pageIndex: number;
  boxes: number[][];
}

export interface RefDocument {
  docName: string;
  refContent: string;
  bboxes: BoundingBox[];
}

export interface RefRegulation {
  docName: string;
  refContent: string;
  regulationCode: string;
  sectionType: string;
  sectionNumber: string;
  pages: number[];
  bboxes: BoundingBox[];
}

export type FieldStatus = 'CRITICAL' | 'WARNING' | 'INFO' | 'OK';

export interface ExtractedField {
  fieldName: string;
  fieldValue: unknown;
  refDocuments: RefDocument[] | null;
  refRegulations: RefRegulation[] | null;
  issue: string | null;
  recommendation: string | null;
  status: FieldStatus;
}

export interface ActiveSource {
  docName: string;
  pageIndex: number;
  boxes: number[][];
  sourceType: 'document' | 'regulation';
}

// UI State Types
export interface UIState {
  isSidebarOpen: boolean;
  isFormBuilderOpen: boolean;
  isMobile: boolean;
}

// Agent Status
export type AgentStatus = 'online' | 'offline' | 'typing';

export interface AgentInfo {
  name: string;
  avatar?: string;
  status: AgentStatus;
}

// Application State
export interface AppState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>; // Keyed by conversation ID
  reviewData: ExtractedField[] | null;
  uiState: UIState;
  agentInfo: AgentInfo;
}
