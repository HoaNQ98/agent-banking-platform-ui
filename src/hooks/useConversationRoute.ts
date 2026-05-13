import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

/**
 * Syncs the :conversationId URL param → store (activeConversationId + messages).
 * Call this once inside MainLayout.
 */
export const useConversationRoute = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { activeConversationId, setActiveConversation, fetchConversationMessages } = useAppStore();

  useEffect(() => {
    if (!conversationId) return;
    if (conversationId === activeConversationId) return;

    setActiveConversation(conversationId);
    fetchConversationMessages(conversationId);
  }, [conversationId, activeConversationId, setActiveConversation, fetchConversationMessages]);
};
