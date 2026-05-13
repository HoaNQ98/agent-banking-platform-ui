import React, { useEffect, useRef, useCallback } from 'react';
import { Button, Typography, Empty } from 'antd';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import ConversationList from './ConversationList';
import ConversationSkeleton from './ConversationSkeleton';
import SidebarFooter from './SidebarFooter';

const { Title, Text } = Typography;

const SCROLL_THRESHOLD = 80; // px from bottom to trigger next page load

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const {
    createConversation,
    remoteConversations,
    isLoadingConversations,
    conversationHasMore,
    fetchConversations,
  } = useAppStore();

  const handleNewConversation = () => {
    const id = createConversation();
    navigate(`/c/${id}`);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    fetchConversations(1);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isLoadingConversations || !conversationHasMore) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= SCROLL_THRESHOLD) {
      fetchConversations();
    }
  }, [isLoadingConversations, conversationHasMore, fetchConversations]);

  const isEmpty = remoteConversations.length === 0 && !isLoadingConversations;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          Conversations
        </Title>
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={handleNewConversation}
          aria-label="New conversation"
        />
      </div>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto' }}
      >
        {/* Initial full-page skeleton while first page loads */}
        {remoteConversations.length === 0 && isLoadingConversations ? (
          <ConversationSkeleton count={8} />
        ) : isEmpty ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              padding: '24px',
            }}
          >
            <Empty
              image={<MessageOutlined style={{ fontSize: 48, color: '#9CA3AF' }} />}
              description={
                <div style={{ textAlign: 'center' }}>
                  <div>
                    <Text strong>No conversations yet</Text>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      Start a new conversation to get assistance
                    </Text>
                  </div>
                </div>
              }
            >
              <Button type="primary" icon={<PlusOutlined />} onClick={handleNewConversation}>
                New Conversation
              </Button>
            </Empty>
          </div>
        ) : (
          <>
            <ConversationList />
            {/* Bottom skeleton while loading next page */}
            {isLoadingConversations && <ConversationSkeleton count={3} />}
          </>
        )}
      </div>

      <SidebarFooter />
    </div>
  );
};

export default Sidebar;
