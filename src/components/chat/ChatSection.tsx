import React, { useRef, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { useAppStore } from '../../store/useAppStore';
import { QUICK_SUGGESTIONS } from '../../constants';
import { useConversationStream } from '../../hooks/useConversationStream';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import EmptyChat from './EmptyChat';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const ChatSection: React.FC = () => {
  const { activeConversationId, messages, isLoadingHistory } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<number | null>(null);

  const { sendMessage } = useConversationStream();

  const handleSuggestionClick = async (message: string) => {
    if (!activeConversationId) return;
    try {
      await sendMessage(activeConversationId, message);
    } catch (err) {
      console.error(err);
    }
  };

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
        background: '#fafafa',
        overflow: 'hidden',
      }}
    >
      {/* Header — masks messages as they scroll behind it */}
      <div style={{ flexShrink: 0, height: '24px', background: '#fafafa', zIndex: 10 }} />

      {/* Scrollable area — same max-width column */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
      {/* Single centered column — both messages and input share this exact container */}
      <div
        style={{
          maxWidth: '800px',
          width: '100%',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
        }}
      >
        {/* Messages — grows to fill available space */}
        <div style={{ flex: 1, position: 'relative' }}>
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
          ) : currentMessages.length === 0 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '28px',
                userSelect: 'none',
                paddingBottom: '80px',
              }}
            >
              {/* Greeting text */}
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '36px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #1677ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2,
                  }}
                >
                  {getGreeting()}
                </span>
                <span style={{ fontSize: '15px', color: '#8c8c8c', fontWeight: 400 }}>
                  How can I help you today?
                </span>
              </div>

              {/* Quick suggestion chips */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '560px' }}>
                {QUICK_SUGGESTIONS.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestionClick(s.label)}
                    onMouseEnter={() => setHoveredSuggestion(i)}
                    onMouseLeave={() => setHoveredSuggestion(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      border: hoveredSuggestion === i ? '1.5px solid #91caff' : '1.5px solid #e8e8e8',
                      background: hoveredSuggestion === i ? '#f0f7ff' : '#fff',
                      color: hoveredSuggestion === i ? '#1677ff' : '#595959',
                      fontSize: '13px',
                      fontWeight: 450,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: hoveredSuggestion === i ? '0 2px 8px rgba(22,119,255,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <MessageList messages={currentMessages} />
          )}
          <div ref={messagesEndRef} style={{ height: '16px' }} />
        </div>

        {/* Input — sticky at bottom, same column as messages */}
        <div
          style={{
            position: 'sticky',
            bottom: 0,
            paddingBottom: '32px',
            paddingTop: '8px',
            background: 'linear-gradient(to bottom, transparent, #fafafa 20px)',
          }}
        >
          <ChatInput />
        </div>
      </div>
      </div>
    </div>
  );
};

export default ChatSection;
