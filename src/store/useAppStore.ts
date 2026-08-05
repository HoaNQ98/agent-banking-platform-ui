import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, Conversation, Message, ExtractedField, ProcessedFile, AgentStatus, ThinkingStep } from '../types';
import { generateId } from '../utils';
import { ConversationService } from '../api/services/conversations';
import type { ConversationItem, StepKind } from '../api/types';

interface ConversationListState {
  remoteConversations: ConversationItem[];
  conversationPage: number;
  conversationHasMore: boolean;
  isLoadingConversations: boolean;
  isLoadingHistory: boolean;
}

interface AppStore extends AppState, ConversationListState {
  // Remote conversation list actions
  fetchConversations: (page?: number) => Promise<void>;
  fetchConversationMessages: (conversationId: string) => Promise<void>;
  prependRemoteConversation: (item: ConversationItem) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;

  // Conversation Actions
  createConversation: () => string;
  setActiveConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;

  // Message Actions
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;

  // Thinking Process Actions
  startThinking: (conversationId: string, messageId: string) => void;
  startThinkingStep: (
    conversationId: string,
    messageId: string,
    step: { key: string; label: string; index?: number; total?: number; kind?: StepKind }
  ) => void;
  completeThinkingStep: (
    conversationId: string,
    messageId: string,
    step: { key: string; summary?: string; failed?: boolean }
  ) => void;
  completeThinking: (conversationId: string, messageId: string) => void;

  // Review Actions
  setReviewData: (data: ExtractedField[] | null) => void;
  setProcessedFiles: (data: ProcessedFile[] | null) => void;

  // UI Actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setFormBuilderOpen: (isOpen: boolean) => void;
  setMobile: (isMobile: boolean) => void;

  // Agent Actions
  setAgentStatus: (status: AgentStatus) => void;

  // Utility Actions
  reset: () => void;
}

const initialState: AppState & ConversationListState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  reviewData: null,
  processedFiles: null,
  uiState: {
    isSidebarOpen: true,
    isFormBuilderOpen: false,
    isMobile: false,
  },
  agentInfo: {
    name: 'Banking Assistant',
    status: 'online',
  },
  remoteConversations: [],
  conversationPage: 0,
  conversationHasMore: true,
  isLoadingConversations: false,
  isLoadingHistory: false,
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Remote conversation list actions
      fetchConversations: async (page?: number) => {
        const { isLoadingConversations, conversationHasMore, conversationPage } =
          useAppStore.getState();
        const nextPage = page ?? conversationPage + 1;

        if (isLoadingConversations || (!conversationHasMore && page === undefined)) return;

        set({ isLoadingConversations: true });
        try {
          const res = await ConversationService.listConversations(nextPage);
          const { data, meta } = res;
          set((state) => ({
            remoteConversations:
              nextPage === 1 ? data : [...state.remoteConversations, ...data],
            conversationPage: nextPage,
            conversationHasMore: meta.pagination.hasNext,
          }));
        } catch (err) {
          console.error('Failed to fetch conversations:', err);
        } finally {
          set({ isLoadingConversations: false });
        }
      },

      fetchConversationMessages: async (conversationId: string) => {
        // Skip if already loaded or currently loading
        const { messages, isLoadingHistory } = useAppStore.getState();
        if (isLoadingHistory || messages[conversationId] !== undefined) return;

        set({ isLoadingHistory: true });
        try {
          const res = await ConversationService.getMessages(conversationId);
          const mapped: Message[] = res.data.map((item) => {
            const readyArtifact = item.artifacts?.find((a) => a.status === 'ready') ?? null;
            return {
              id: item.id,
              role: item.role === 'user' ? 'user' : 'agent',
              content: item.content ?? '',
              type: 'text' as Message['type'],
              timestamp: new Date(item.createdAt),
              attachments: item.attachments?.map((a) => ({
                id: a.fileId,
                name: a.fileName,
                type: a.fileType ?? '',
                size: 0,
                url: a.downloadUrl ?? a.filePath,
              })),
              artifact: readyArtifact ? {
                artifactId: readyArtifact.id,
                artifactType: readyArtifact.artifactType,
                data: readyArtifact.data as Record<string, unknown>,
                processedFiles: (readyArtifact.data as Record<string, unknown>)?.processedFiles as ProcessedFile[] | undefined,
              } : undefined,
            };
          });
          set((state) => ({
            messages: { ...state.messages, [conversationId]: mapped },
          }));
        } catch (err) {
          console.error('Failed to fetch conversation history:', err);
          // Set empty array so we don't retry on every click
          set((state) => ({
            messages: { ...state.messages, [conversationId]: [] },
          }));
        } finally {
          set({ isLoadingHistory: false });
        }
      },

      setMessages: (conversationId: string, messages: Message[]) => {
        set((state) => ({
          messages: { ...state.messages, [conversationId]: messages },
        }));
      },

      prependRemoteConversation: (item: ConversationItem) => {
        set((state) => ({
          remoteConversations: [
            item,
            ...state.remoteConversations.filter((c) => c.id !== item.id),
          ],
        }));
      },

      // Conversation Actions
      createConversation: () => {
        const newConversation: Conversation = {
          id: generateId(),
          title: 'New Conversation',
          timestamp: new Date(),
          isActive: true,
          messageCount: 0,
        };

        set((state) => {
          const updatedConversations = state.conversations.map((conv) => ({
            ...conv,
            isActive: false,
          }));

          return {
            conversations: [newConversation, ...updatedConversations],
            activeConversationId: newConversation.id,
            messages: {
              ...state.messages,
              [newConversation.id]: [],
            },
          };
        });

        return newConversation.id;
      },

      setActiveConversation: (id: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) => ({
            ...conv,
            isActive: conv.id === id,
          })),
          activeConversationId: id,
        }));
      },

      updateConversationTitle: (id: string, title: string) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, title } : conv
          ),
        }));
      },

      deleteConversation: (id: string) => {
        set((state) => {
          const filteredConversations = state.conversations.filter((conv) => conv.id !== id);
          const newMessages = { ...state.messages };
          delete newMessages[id];

          return {
            conversations: filteredConversations,
            messages: newMessages,
            activeConversationId:
              state.activeConversationId === id
                ? filteredConversations[0]?.id || null
                : state.activeConversationId,
          };
        });
      },

      // Message Actions
      addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        };

        set((state) => {
          const conversationMessages = state.messages[conversationId] || [];
          const updatedMessages = [...conversationMessages, newMessage];

          // Update conversation last message and timestamp
          const updatedConversations = state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: message.content.substring(0, 50),
                  timestamp: new Date(),
                  messageCount: updatedMessages.length,
                }
              : conv
          );

          // Auto-update conversation title from first user message
          const isFirstUserMessage = conversationMessages.filter((m) => m.role === 'user').length === 0;
          if (message.role === 'user' && isFirstUserMessage) {
            const titleConversations = updatedConversations.map((conv) =>
              conv.id === conversationId
                ? { ...conv, title: message.content.substring(0, 30) }
                : conv
            );
            return {
              conversations: titleConversations,
              messages: {
                ...state.messages,
                [conversationId]: updatedMessages,
              },
            };
          }

          return {
            conversations: updatedConversations,
            messages: {
              ...state.messages,
              [conversationId]: updatedMessages,
            },
          };
        });

        return newMessage;
      },

      updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.map((msg) =>
              msg.id === messageId ? { ...msg, ...updates } : msg
            ),
          },
        }));
      },

      deleteMessage: (conversationId: string, messageId: string) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.filter(
              (msg) => msg.id !== messageId
            ),
          },
        }));
      },

      // Thinking Process Actions
      startThinking: (conversationId: string, messageId: string) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    thinkingProcess: {
                      steps: [],
                      status: 'in_progress' as const,
                      startTime: new Date(),
                    },
                  }
                : msg
            ),
          },
        }));
      },

      // Begin a step — append a new 'active' row, or reactivate an existing key.
      startThinkingStep: (conversationId, messageId, step) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.map((msg) => {
              if (msg.id !== messageId || !msg.thinkingProcess) return msg;
              const existing = msg.thinkingProcess.steps;
              const alreadyThere = existing.some((s) => s.key === step.key);
              const steps = alreadyThere
                ? existing.map((s) =>
                    s.key === step.key ? { ...s, status: 'active' as const } : s
                  )
                : [
                    ...existing,
                    {
                      key: step.key,
                      label: step.label,
                      status: 'active' as const,
                      index: step.index,
                      total: step.total,
                      kind: step.kind,
                    },
                  ];
              return { ...msg, thinkingProcess: { ...msg.thinkingProcess, steps } };
            }),
          },
        }));
      },

      // Finish a step — mark its row done/failed and attach an optional summary.
      completeThinkingStep: (conversationId, messageId, step) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.map((msg) => {
              if (msg.id !== messageId || !msg.thinkingProcess) return msg;
              const steps = msg.thinkingProcess.steps.map((s) =>
                s.key === step.key
                  ? {
                      ...s,
                      status: (step.failed ? 'failed' : 'done') as ThinkingStep['status'],
                      summary: step.summary || s.summary,
                    }
                  : s
              );
              return { ...msg, thinkingProcess: { ...msg.thinkingProcess, steps } };
            }),
          },
        }));
      },

      completeThinking: (conversationId: string, messageId: string) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.map((msg) =>
              msg.id === messageId && msg.thinkingProcess
                ? {
                    ...msg,
                    thinkingProcess: {
                      ...msg.thinkingProcess,
                      status: 'completed' as const,
                      endTime: new Date(),
                    },
                  }
                : msg
            ),
          },
        }));
      },

      setReviewData: (data: ExtractedField[] | null) => {
        set({ reviewData: data });
      },

      setProcessedFiles: (data: ProcessedFile[] | null) => {
        set({ processedFiles: data });
      },

      // UI Actions
      toggleSidebar: () => {
        set((state) => ({
          uiState: { ...state.uiState, isSidebarOpen: !state.uiState.isSidebarOpen },
        }));
      },

      setSidebarOpen: (isOpen: boolean) => {
        set((state) => ({
          uiState: { ...state.uiState, isSidebarOpen: isOpen },
        }));
      },

      setFormBuilderOpen: (isOpen: boolean) => {
        set((state) => ({
          uiState: { ...state.uiState, isFormBuilderOpen: isOpen },
        }));
      },

      setMobile: (isMobile: boolean) => {
        set((state) => ({
          uiState: { ...state.uiState, isMobile },
        }));
      },

      // Agent Actions
      setAgentStatus: (status: AgentStatus) => {
        set((state) => ({
          agentInfo: { ...state.agentInfo, status },
        }));
      },

      // Utility Actions
      reset: () => {
        set(initialState);
      },
    }),
    { name: 'AppStore' }
  )
);
