/**
 * Conversation API Service
 *
 * Handles conversation message creation with support for both
 * streaming and non-streaming responses.
 */

import { getApiUrl } from '../config';
import { client, APIException } from '../client';
import type {
  ConversationInput,
  ConversationResponse,
  ConversationStreamEvent,
  ListConversationsResponse,
  ListConversationMessagesResponse,
} from '../types';

/**
 * Parameters for sending a message
 */
export interface SendMessageParams {
  conversationId: string;
  message: string;
  role?: string;
  files?: File[];
  metadata?: Record<string, any>;
  stream?: boolean;
  onEvent?: (event: ConversationStreamEvent) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

/**
 * Convert a File to base64 string
 */
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convert File array to API FileUpload format
 */
const convertFilesToUploads = async (files: File[]) => {
  const uploads = await Promise.all(
    files.map(async (file) => ({
      file_name: file.name,
      file_content: await fileToBase64(file),
      file_type: file.type,
      file_size: file.size,
    }))
  );
  return uploads;
};

/**
 * Handle streaming response from the API
 */
const handleStreamingResponse = async (
  response: Response,
  onEvent?: (event: ConversationStreamEvent) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): Promise<void> => {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error('Response body is not readable');
  }

  try {
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onComplete?.();
        break;
      }

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines (events)
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.trim()) {
          try {
            const event: ConversationStreamEvent = JSON.parse(line);

            if (event.event === 'error') {
              onError?.(new Error(event.error || 'Stream error occurred'));
              onEvent?.(event);
            } else {
              onEvent?.(event);
            }
          } catch (parseError) {
            console.error('Failed to parse event:', line, parseError);
          }
        }
      }
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Stream reading failed');
    onError?.(err);
  } finally {
    reader.releaseLock();
  }
};

/**
 * Conversation API Service
 */
export const ConversationService = {
  /**
   * Send a message to a conversation
   * Supports both streaming and non-streaming modes
   */
  async sendMessage(params: SendMessageParams): Promise<ConversationResponse | void> {
    const {
      conversationId,
      message,
      role = 'user',
      files = [],
      metadata,
      stream = true,
      onEvent,
      onError,
      onComplete,
    } = params;

    try {
      // Convert files to base64 if present
      const fileUploads = files.length > 0 ? await convertFilesToUploads(files) : undefined;

      // Prepare request payload
      const payload: ConversationInput = {
        conversation_id: conversationId,
        role,
        message,
        files: fileUploads,
        metadata,
        stream,
      };

      const url = getApiUrl('/conversations');

      if (stream) {
        // Streaming mode: use fetch directly to handle SSE
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          let errorDetail = 'Failed to send message';
          try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
          } catch {
            errorDetail = response.statusText || errorDetail;
          }
          throw new APIException(response.status, errorDetail);
        }

        // Handle streaming response
        await handleStreamingResponse(response, onEvent, onError, onComplete);
      } else {
        // Non-streaming mode: use regular client
        const response = await client.post<ConversationResponse>(url, payload);
        onComplete?.();
        return response;
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
      throw err;
    }
  },

  /**
   * Fetch a paginated list of conversations for the sidebar
   */
  async listConversations(page = 1, perPage = 20): Promise<ListConversationsResponse> {
    const url = getApiUrl(`/conversations?page=${page}&per_page=${perPage}`);
    return client.get<ListConversationsResponse>(url);
  },

  /**
   * Fetch paginated message history for a conversation
   */
  async getMessages(conversationId: string, page = 1, perPage = 50): Promise<ListConversationMessagesResponse> {
    const url = getApiUrl(`/conversations/${conversationId}/messages?page=${page}&per_page=${perPage}`);
    return client.get<ListConversationMessagesResponse>(url);
  },

  /**
   * Health check for conversations API
   */
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    const url = getApiUrl('/conversations/health');
    return client.get(url);
  },
};

export default ConversationService;
