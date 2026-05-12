import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AppState, Conversation, Message, FormData, ExtractedField, AgentStatus } from '../types';
import { generateId } from '../utils';
import { DEFAULT_MESSAGES } from '../constants';

interface AppStore extends AppState {
  // Conversation Actions
  createConversation: () => void;
  setActiveConversation: (id: string) => void;
  updateConversationTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;

  // Message Actions
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => Message;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;

  // Thinking Process Actions
  startThinking: (conversationId: string, messageId: string) => void;
  appendThinking: (conversationId: string, messageId: string, text: string) => void;
  completeThinking: (conversationId: string, messageId: string) => void;

  // Form Actions
  setCurrentForm: (form: FormData | null) => void;
  updateFormField: (fieldId: string, value: unknown) => void;

  // Review Actions
  setReviewData: (data: ExtractedField[] | null) => void;

  // UI Actions
  toggleSidebar: () => void;
  toggleFormBuilder: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setFormBuilderOpen: (isOpen: boolean) => void;
  setMobile: (isMobile: boolean) => void;

  // Agent Actions
  setAgentStatus: (status: AgentStatus) => void;

  // Utility Actions
  reset: () => void;
}

const initialState: AppState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  currentForm: null,
  reviewData: null,
  uiState: {
    isSidebarOpen: true,
    isFormBuilderOpen: false,
    isMobile: false,
  },
  agentInfo: {
    name: 'Banking Assistant',
    status: 'online',
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set) => ({
      ...initialState,

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
          // Set all other conversations to inactive
          const updatedConversations = state.conversations.map((conv) => ({
            ...conv,
            isActive: false,
          }));

          return {
            conversations: [newConversation, ...updatedConversations],
            activeConversationId: newConversation.id,
            messages: {
              ...state.messages,
              [newConversation.id]: [
                {
                  id: generateId(),
                  role: 'agent',
                  content: DEFAULT_MESSAGES.WELCOME,
                  type: 'text',
                  timestamp: new Date(),
                },
              ],
            },
          };
        });
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
                      content: '',
                      status: 'in_progress' as const,
                      startTime: new Date(),
                    },
                  }
                : msg
            ),
          },
        }));
      },

      appendThinking: (conversationId: string, messageId: string, text: string) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: state.messages[conversationId]?.map((msg) =>
              msg.id === messageId && msg.thinkingProcess
                ? {
                    ...msg,
                    thinkingProcess: {
                      ...msg.thinkingProcess,
                      content: msg.thinkingProcess.content + text,
                    },
                  }
                : msg
            ),
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

      // Form Actions
      setCurrentForm: (form: FormData | null) => {
        set({ currentForm: form });
      },

      setReviewData: (data: ExtractedField[] | null) => {
        set({ reviewData: data });
      },

      updateFormField: (fieldId: string, value: unknown) => {
        set((state) => {
          if (!state.currentForm) return state;
          return {
            currentForm: {
              ...state.currentForm,
              fields: state.currentForm.fields.map((field) =>
                field.id === fieldId ? { ...field, defaultValue: value as string | number } : field
              ),
            },
          };
        });
      },

      // UI Actions
      toggleSidebar: () => {
        set((state) => ({
          uiState: { ...state.uiState, isSidebarOpen: !state.uiState.isSidebarOpen },
        }));
      },

      toggleFormBuilder: () => {
        set((state) => ({
          uiState: { ...state.uiState, isFormBuilderOpen: !state.uiState.isFormBuilderOpen },
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
