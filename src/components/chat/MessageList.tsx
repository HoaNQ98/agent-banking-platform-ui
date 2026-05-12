import React from 'react';
import { Typography, Button } from 'antd';
import { FileOutlined, FormOutlined, FileSearchOutlined } from '@ant-design/icons';
import type { Message, ExtractedField } from '../../types';
import { formatRelativeTime, getFileIcon } from '../../utils';
import { useAppStore } from '../../store/useAppStore';
import MarkdownMessage from './MarkdownMessage';
import ThinkingPanel from './ThinkingPanel';

const { Text } = Typography;

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { setFormBuilderOpen, setReviewData } = useAppStore();

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    const isLoading = message.type === 'loading';
    const isFormTrigger = message.type === 'form-trigger';
    const showLoadingDots = !isUser && (isLoading || (!message.content && message.metadata?.isStreaming !== false));

    return (
      <div
        key={message.id}
        style={{
          display: 'flex',
          marginBottom: '20px',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          animation: 'fadeInUp 0.3s ease-out',
          gap: '12px',
        }}
      >
        {/* Agent Avatar */}
        {!isUser && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              fontSize: '18px',
            }}
          >
            🤖
          </div>
        )}

        <div
          style={{
            maxWidth: isUser ? '65%' : '75%',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {/* Message Header - Name and Timestamp */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: isUser ? 'flex-end' : 'flex-start',
              paddingLeft: isUser ? '0' : '4px',
              paddingRight: isUser ? '4px' : '0',
            }}
          >
            {!isUser && (
              <Text
                strong
                style={{
                  fontSize: '12px',
                  color: '#667eea',
                }}
              >
                Banking Assistant
              </Text>
            )}
            <Text type="secondary" style={{ fontSize: '11px', color: '#8c8c8c' }}>
              {formatRelativeTime(message.timestamp)}
            </Text>
            {isUser && (
              <Text
                strong
                style={{
                  fontSize: '12px',
                  color: '#1890ff',
                }}
              >
                You
              </Text>
            )}
          </div>

          {/* Message Bubble */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              background: isUser
                ? 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
                : '#ffffff',
              color: isUser ? '#fff' : '#262626',
              boxShadow: isUser
                ? '0 2px 12px rgba(24, 144, 255, 0.25)'
                : '0 2px 12px rgba(0, 0, 0, 0.08)',
              border: isUser ? 'none' : '1px solid #f0f0f0',
              borderBottomRightRadius: isUser ? '4px' : '16px',
              borderBottomLeftRadius: isUser ? '16px' : '4px',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            {/* Loading State */}
            {showLoadingDots ? (
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  padding: '4px 0',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isUser ? 'rgba(255, 255, 255, 0.7)' : '#667eea',
                    animation: 'dotPulse 1.4s infinite ease-in-out',
                  }}
                />
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isUser ? 'rgba(255, 255, 255, 0.7)' : '#667eea',
                    animation: 'dotPulse 1.4s infinite ease-in-out 0.2s',
                  }}
                />
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: isUser ? 'rgba(255, 255, 255, 0.7)' : '#667eea',
                    animation: 'dotPulse 1.4s infinite ease-in-out 0.4s',
                  }}
                />
              </div>
            ) : (
              <>
                {/* Thinking Panel (for agent messages with thinking process) */}
                {!isUser && message.thinkingProcess && (
                  <ThinkingPanel thinking={message.thinkingProcess} />
                )}

                {/* Message Content with Markdown Support */}
                <MarkdownMessage
                  content={message.content}
                  isUser={isUser}
                  isStreaming={!isUser && message.metadata?.isStreaming === true}
                />

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div
                    style={{
                      marginTop: '12px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    {message.attachments.map((file) => (
                      <div
                        key={file.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: isUser
                            ? 'rgba(255, 255, 255, 0.2)'
                            : '#f7f9fc',
                          border: isUser ? 'none' : '1px solid #e8e8e8',
                          fontSize: '12px',
                          color: isUser ? '#fff' : '#595959',
                        }}
                      >
                        <FileOutlined style={{ fontSize: '14px' }} />
                        <span>
                          {getFileIcon(file.type)} {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form Trigger Button */}
                {isFormTrigger && !message.metadata?.reviewData && (
                  <Button
                    type="primary"
                    icon={<FormOutlined />}
                    onClick={() => setFormBuilderOpen(true)}
                    style={{ marginTop: '8px' }}
                  >
                    View Form Builder →
                  </Button>
                )}

                {/* Document Review Trigger */}
                {isFormTrigger && message.metadata?.reviewData && (
                  <Button
                    type="primary"
                    icon={<FileSearchOutlined />}
                    onClick={() => {
                      setReviewData(message.metadata!.reviewData as ExtractedField[]);
                      setFormBuilderOpen(true);
                    }}
                    style={{ marginTop: '8px' }}
                  >
                    Review Extracted Data →
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* User Avatar */}
        {isUser && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
              fontSize: '18px',
            }}
          >
            👤
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {messages.map((message) => renderMessage(message))}
    </div>
  );
};

export default MessageList;
