import React, { useRef, useEffect } from 'react';
import { Spin } from 'antd';
import { useAppStore } from '../../store/useAppStore';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import EmptyChat from './EmptyChat';

const ChatSection: React.FC = () => {
  const { activeConversationId, messages, isLoadingHistory } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  if (!activeConversationId) {
    return <EmptyChat />;
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f5',
      }}
    >
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: '896px', margin: '0 auto' }}>
          {isLoadingHistory ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                height: '200px',
                color: '#8c8c8c',
                fontSize: '14px',
              }}
            >
              <Spin size="large" />
              Loading conversation...
            </div>
          ) : (
            <MessageList messages={currentMessages} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <ChatInput />
    </div>
  );
};

export default ChatSection;
