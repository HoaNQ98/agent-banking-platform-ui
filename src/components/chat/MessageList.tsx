import React from 'react';
import { Typography, Button } from 'antd';
import { FileOutlined, FileSearchOutlined, ArrowRightOutlined } from '@ant-design/icons';
import type { Message, ExtractedField } from '../../types';
import { formatRelativeTime, getFileIcon } from '../../utils';
import { useAppStore } from '../../store/useAppStore';
import { ArtifactTypeLabel } from '../../api/types';
import type { ArtifactTypeValue } from '../../api/types';
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

                {/* Artifact Review Trigger */}
                {isFormTrigger && message.metadata?.artifact && (
                  <div
                    onClick={() => {
                      const fields = (message.metadata!.artifact as Record<string, unknown>).fields as ExtractedField[];
                      setReviewData(fields);
                      setFormBuilderOpen(true);
                    }}
                    style={{
                      marginTop: '12px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.55)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      boxShadow: '0 2px 12px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.75)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255,255,255,0.8)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.55)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(102, 126, 234, 0.2)';
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(102, 126, 234, 0.35)',
                      }}
                    >
                      <FileSearchOutlined style={{ color: '#fff', fontSize: '15px' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: '#8c8c8c', lineHeight: '1.3' }}>Document</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#262626', lineHeight: '1.4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ArtifactTypeLabel[message.metadata.artifactType as ArtifactTypeValue] ?? 'Review Artifact'}
                      </div>
                    </div>
                    <ArrowRightOutlined style={{ color: '#667eea', fontSize: '13px', flexShrink: 0 }} />
                  </div>
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
