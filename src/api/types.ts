/**
 * API Types
 *
 * Type definitions matching the backend API schemas.
 * These types mirror the Pydantic models from the backend.
 */

/**
 * File upload information for sending to API
 */
export interface FileUpload {
  file_name: string;
  file_content: string; // Base64-encoded content
  file_type?: string; // MIME type
  file_size?: number; // Size in bytes
}

/**
 * Information about an uploaded file (from API response)
 */
export interface UploadedFileInfo {
  file_id: string;
  file_name: string;
  file_path: string;
  absolute_path: string;
  file_size: number;
  file_type?: string;
  uploaded_at: string; // ISO timestamp
}

/**
 * Input for creating a conversation message
 */
export interface ConversationInput {
  conversation_id: string; // UUID v4
  role: string; // 'user' | 'assistant' | 'system'
  message: string;
  files?: FileUpload[];
  metadata?: Record<string, any>;
  stream: boolean;
}

/**
 * Stream event types from the API
 */
export type StreamEventType =
  | 'files_processing'
  | 'files_uploaded'
  | 'text_delta'
  | 'tool_result'           // Internal tool results for "thinking process"
  | 'pipeline_step_start'   // Pipeline node started (steps 1-4)
  | 'pipeline_step_complete'// Pipeline node finished (steps 1-4)
  | 'metadata'
  | 'message_complete'
  | 'error';

/**
 * Source of the streaming event
 */
export type StreamEventSource = 'orchestrator' | 'subagent';

/**
 * Metadata event types (nested inside metadata field)
 */
export type MetadataEventType = 'subagent_start' | 'subagent_complete' | 'step_update';

/**
 * Metadata structure for SSE events
 */
export interface EventMetadata {
  // For text_delta events (now at root level, not nested in metadata)
  source?: StreamEventSource; // 'orchestrator' | 'subagent'
  subagent?: string; // Name of the subagent
  node?: string; // LangGraph node name
  is_subagent?: boolean; // Whether message is from subagent

  // For metadata events (type: "metadata")
  event_type?: MetadataEventType; // 'subagent_start' | 'subagent_complete' | 'step_update'
  message?: string; // Message for subagent events

  // For step_update events
  updates?: Record<string, any>; // Internal state updates

  // Other metadata
  [key: string]: any;
}

/**
 * Pipeline step metadata attached to text_delta events from pipeline nodes.
 * Set via additional_kwargs in pipeline_nodes.py.
 */
export interface PipelineStepMetadata {
  pipeline_step?: string;       // "extraction" | "relationships" | "financial" | "regulations" | "advice"
  pipeline_intermediate?: boolean; // true for steps 1-4 — route to ThinkingPanel, not main chat
  pipeline_final?: boolean;        // true for step 5 — route to main chat
  step_index?: number;             // 1-based
  [key: string]: any;
}

/**
 * Server-Sent Event for streaming responses.
 */
export interface ConversationStreamEvent {
  event: StreamEventType;

  conversation_id?: string;
  conversationId?: string;

  // For text streaming (text_delta)
  role?: string;
  delta?: string;
  source?: StreamEventSource;
  node?: string;
  is_subagent?: boolean;
  metadata?: PipelineStepMetadata & EventMetadata; // pipeline tags + other metadata

  // For tool results (tool_result)
  agent?: string;
  content?: string;

  // For pipeline step lifecycle (pipeline_step_start / pipeline_step_complete)
  step?: string;       // step name e.g. "extraction"
  step_index?: number; // 1-based
  total_steps?: number;

  // For file processing
  files_uploaded?: UploadedFileInfo[];

  // For completion
  message_id?: string;
  full_message?: string;

  // For errors
  error?: string;
}

/**
 * Non-streaming conversation response
 */
export interface ConversationResponse {
  conversation_id: string;
  message_id: string;
  role: string;
  message: string;
  uploaded_files?: UploadedFileInfo[];
  metadata?: Record<string, any>;
  created_at: string; // ISO timestamp
}

/**
 * API Error response
 */
export interface APIError {
  detail: string;
  status?: number;
}

/**
 * A single conversation entry from the list API
 */
export interface ConversationItem {
  id: string;
  firstMessage: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ListConversationsResponse {
  status: string;
  data: ConversationItem[];
  meta: {
    pagination: PaginationMeta;
  };
}

/**
 * A single attachment reference stored on a message
 */
export interface AttachmentInfo {
  file_id: string;
  file_name: string;
  file_path: string;
  file_type?: string;
}

/**
 * Artifact type constants — mirrors backend ArtifactType
 */
export const ArtifactType = {
  LC_FORM_ADVISORY: 'lc_form_advisory',
} as const;

export type ArtifactTypeValue = typeof ArtifactType[keyof typeof ArtifactType];

/**
 * Human-readable button labels for each artifact type shown in the chat.
 */
export const ArtifactTypeLabel: Record<ArtifactTypeValue, string> = {
  lc_form_advisory: 'Review LC Form Advisory',
};

/**
 * Artifact status constants — mirrors backend ArtifactStatus
 */
export const ArtifactStatus = {
  PENDING: 'pending',
  GENERATING: 'generating',
  READY: 'ready',
  FAILED: 'failed',
} as const;

export type ArtifactStatusValue = typeof ArtifactStatus[keyof typeof ArtifactStatus];

/**
 * A single artifact attached to a message
 */
export interface ArtifactItem {
  id: string;
  messageId: string;
  conversationId: string;
  artifactType: ArtifactTypeValue;
  status: ArtifactStatusValue;
  data: Record<string, unknown> | null;
  error: string | null;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Request body for POST /messages/{messageId}/artifact
 */
export interface ArtifactGenerateRequest {
  conversationId: string;
  artifactType: ArtifactTypeValue;
}

/**
 * A single message from the history endpoint
 */
export interface ConversationMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string | null;
  attachments: AttachmentInfo[] | null;
  artifacts: ArtifactItem[] | null;
  createdAt: string;
}

export interface ListConversationMessagesResponse {
  status: string;
  data: ConversationMessageItem[];
  meta: {
    pagination: PaginationMeta;
  };
}

/**
 * Response for POST /messages/{messageId}/artifact
 */
export interface ArtifactGenerateResponse {
  status: string;
  data: ArtifactItem;
}
