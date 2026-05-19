/**
 * useConversationStream Hook
 *
 * Custom hook for handling streaming conversations with the API.
 * Manages SSE connections, message state, and real-time updates.
 */

import { useState, useCallback, useRef } from 'react';
import { ConversationService } from '../api/services/conversations';
import type { ConversationStreamEvent, UploadedFileInfo } from '../api/types';
import { useAppStore } from '../store/useAppStore';
import type { ExtractedField, FileAttachment } from '../types';


interface UseConversationStreamOptions {
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

interface StreamState {
  isStreaming: boolean;
  error: string | null;
  uploadedFiles: UploadedFileInfo[];
}

export const useConversationStream = (options: UseConversationStreamOptions = {}) => {
  const [state, setState] = useState<StreamState>({
    isStreaming: false,
    error: null,
    uploadedFiles: [],
  });

  const { addMessage, updateMessage, startThinking, appendThinking, completeThinking, messages, prependRemoteConversation, setFormBuilderOpen, setReviewData } = useAppStore();
  const currentMessageIdRef = useRef<string | null>(null);
  const accumulatedTextRef = useRef<string>('');
  const isThinkingStartedRef = useRef<boolean>(false);

  /**
   * Get display name for agent
   */
  const getAgentDisplayName = (source: string): string => {
    switch (source) {
      case 'orchestrator':
        return 'Banking Assistant';
      case 'document-extraction':
        return 'Document Extraction Agent';
      case 'customer-advisor':
        return 'Customer Advisor';
      case 'document-analysis':
        return 'Document Analysis Agent';
      case 'lc_financial':
        return 'Financial Analysis Agent';
      default:
        return 'Assistant';
    }
  };

  /**
   * Get icon for agent
   */
  const getAgentIcon = (source: string): string => {
    switch (source) {
      case 'orchestrator':
        return '🤖';
      case 'document-extraction':
        return '📄';
      case 'customer-advisor':
        return '💼';
      case 'document-analysis':
        return '🔍';
      case 'lc_financial':
        return '💰';
      default:
        return '🤖';
    }
  };

  /**
   * Reset stream state
   */
  const resetState = useCallback(() => {
    setState({
      isStreaming: false,
      error: null,
      uploadedFiles: [],
    });
    currentMessageIdRef.current = null;
    accumulatedTextRef.current = '';
    isThinkingStartedRef.current = false;
  }, []);

  /**
   * Handle stream events from the API
   */
  const handleStreamEvent = useCallback(
    (conversationId: string) => (event: ConversationStreamEvent) => {
      console.log('Stream event:', event);

      switch (event.event) {
        case 'files_processing':
          // Files are being processed - could show progress indicator
          console.log('Processing files...');
          break;

        case 'files_uploaded':
          // Files successfully uploaded
          if (event.files_uploaded) {
            setState((prev) => ({
              ...prev,
              uploadedFiles: event.files_uploaded || [],
            }));
          }
          break;

        case 'text_delta':
          if (event.delta && currentMessageIdRef.current) {
            const isIntermediate = event.metadata?.pipeline_intermediate === true;

            if (isIntermediate) {
              // Pipeline steps 1-4: stream into ThinkingPanel, not main chat
              if (!isThinkingStartedRef.current) {
                startThinking(conversationId, currentMessageIdRef.current);
                isThinkingStartedRef.current = true;
              }
              appendThinking(conversationId, currentMessageIdRef.current, event.delta);
            } else {
              // Normal response or pipeline final step: render in main chat
              const source = event.source || 'orchestrator';
              accumulatedTextRef.current += event.delta;
              updateMessage(conversationId, currentMessageIdRef.current, {
                content: accumulatedTextRef.current,
                type: 'text',
                metadata: {
                  isStreaming: true,
                  source,
                  agentName: getAgentDisplayName(source),
                  agentIcon: getAgentIcon(source),
                },
              });
            }
          }
          break;

        case 'pipeline_step_start':
          // Show step progress in ThinkingPanel
          if (currentMessageIdRef.current) {
            if (!isThinkingStartedRef.current) {
              startThinking(conversationId, currentMessageIdRef.current);
              isThinkingStartedRef.current = true;
            }
            const stepName = event.step || '';
            const stepLabel = stepName.charAt(0).toUpperCase() + stepName.slice(1);
            appendThinking(
              conversationId,
              currentMessageIdRef.current,
              `\n⏳ Step ${event.step_index}/${event.total_steps} — ${stepLabel}...\n`
            );
          }
          break;

        case 'pipeline_step_complete':
          // Mark step done in ThinkingPanel
          if (currentMessageIdRef.current) {
            const stepName = event.step || '';
            const stepLabel = stepName.charAt(0).toUpperCase() + stepName.slice(1);
            appendThinking(
              conversationId,
              currentMessageIdRef.current,
              `✓ Step ${event.step_index}/${event.total_steps} — ${stepLabel} complete\n`
            );
          }
          break;

        case 'pipeline_step_failed':
          // Mark step failed in ThinkingPanel
          if (currentMessageIdRef.current) {
            const stepName = event.step || '';
            const stepLabel = stepName.charAt(0).toUpperCase() + stepName.slice(1);
            appendThinking(
              conversationId,
              currentMessageIdRef.current,
              `✗ Step ${event.step_index}/${event.total_steps} — ${stepLabel} failed\n`
            );
          }
          break;

        case 'artifact':
          // Pipeline produced an artifact — populate review data, add trigger bubble, auto-open
          if (event.artifact && event.artifactType) {
            const fields = (event.artifact.data as Record<string, unknown>)?.fields;
            if (fields) {
              setReviewData(fields as ExtractedField[]);
            }
            addMessage(conversationId, {
              role: 'agent',
              content: '',
              type: 'form-trigger',
              metadata: {
                artifactId: event.artifact.id,
                artifactType: event.artifactType,
                messageId: event.artifact.messageId,
              },
            });
            setFormBuilderOpen(true);
          }
          break;

        case 'tool_result':
          // Non-pipeline internal tool results — display in ThinkingPanel
          if (event.content && currentMessageIdRef.current) {
            if (!isThinkingStartedRef.current) {
              startThinking(conversationId, currentMessageIdRef.current);
              isThinkingStartedRef.current = true;
            }
            const agentName = event.agent || 'agent';
            appendThinking(conversationId, currentMessageIdRef.current, `[${agentName}] ${event.content}`);
          }
          break;

        case 'metadata':
          // Handle metadata events (for backward compatibility)
          // Most metadata is now in text_delta events
          break;

        case 'message_complete':
          // Stream completed
          if (currentMessageIdRef.current) {
            // Complete thinking process if it was started
            if (isThinkingStartedRef.current) {
              completeThinking(conversationId, currentMessageIdRef.current);
              isThinkingStartedRef.current = false;
            }

            // Convert uploaded files to attachments format
            const attachments: FileAttachment[] | undefined =
              state.uploadedFiles.length > 0
                ? state.uploadedFiles.map((file) => ({
                    id: file.file_id,
                    name: file.file_name,
                    type: file.file_type || 'unknown',
                    size: file.file_size,
                    url: file.file_path,
                  }))
                : undefined;

            updateMessage(conversationId, currentMessageIdRef.current, {
              content: event.full_message || accumulatedTextRef.current,
              type: 'text',
              attachments,
              metadata: {
                ...event.metadata,
                messageId: event.message_id,
                isStreaming: false, // Mark streaming as complete
              },
            });
          }
          break;

        case 'error':
          // Handle error from stream
          const errorMsg = event.error || 'An error occurred during streaming';

          // Complete thinking process if it was started
          if (currentMessageIdRef.current && isThinkingStartedRef.current) {
            completeThinking(conversationId, currentMessageIdRef.current);
            isThinkingStartedRef.current = false;
          }

          setState((prev) => ({ ...prev, error: errorMsg }));
          options.onError?.(new Error(errorMsg));
          break;
      }
    },
    [addMessage, updateMessage, startThinking, appendThinking, completeThinking, setFormBuilderOpen, setReviewData, state.uploadedFiles, options]
  );

  /**
   * Send a message with streaming support
   */
  const sendMessage = useCallback(
    async (
      conversationId: string,
      message: string,
      files?: File[]
    ): Promise<void> => {
      try {
        resetState();
        setState((prev) => ({ ...prev, isStreaming: true }));

        // Convert files to attachments for user message
        const userAttachments: FileAttachment[] | undefined = files && files.length > 0
          ? files.map((file, index) => ({
              id: `${Date.now()}-${index}`,
              name: file.name,
              type: file.type,
              size: file.size,
            }))
          : undefined;

        // Add user message with file attachments
        addMessage(conversationId, {
          role: 'user',
          content: message,
          type: 'text',
          attachments: userAttachments,
        });

        // On first user message, optimistically prepend to the sidebar list
        const existingMessages = messages[conversationId] ?? [];
        const isFirstUserMessage = !existingMessages.some((m) => m.role === 'user');
        if (isFirstUserMessage) {
          prependRemoteConversation({
            id: conversationId,
            firstMessage: message,
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: null,
          });
        }

        // Create a loading placeholder until first text arrives
        const agentMessage = addMessage(conversationId, {
          role: 'agent',
          content: '',
          type: 'loading',
        });

        currentMessageIdRef.current = agentMessage.id;
        accumulatedTextRef.current = '';

        // Send to API with streaming
        await ConversationService.sendMessage({
          conversationId,
          message,
          files,
          stream: true,
          onEvent: handleStreamEvent(conversationId),
          onError: (error) => {
            setState((prev) => ({ ...prev, error: error.message }));
            options.onError?.(error);

            if (currentMessageIdRef.current) {
              updateMessage(conversationId, currentMessageIdRef.current, {
                content: 'Sorry, an error occurred while processing your message.',
                type: 'text',
                metadata: { isStreaming: false },
              });
            }
          },
          onComplete: () => {
            setState((prev) => ({ ...prev, isStreaming: false }));
            options.onComplete?.();
          },
        });
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: err.message,
        }));
        options.onError?.(err);

        if (currentMessageIdRef.current) {
          updateMessage(conversationId, currentMessageIdRef.current, {
            content: 'Sorry, an error occurred while processing your message.',
            type: 'text',
            metadata: { isStreaming: false },
          });
        }
      }
    },
    [resetState, addMessage, updateMessage, handleStreamEvent, messages, prependRemoteConversation, options]
  );

  return {
    sendMessage,
    isStreaming: state.isStreaming,
    error: state.error,
    uploadedFiles: state.uploadedFiles,
    resetState,
  };
};

export default useConversationStream;
