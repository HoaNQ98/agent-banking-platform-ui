import React from 'react';
import { FileOutlined, FileSearchOutlined, ArrowRightOutlined } from '@ant-design/icons';
import type { Message, ExtractedField } from '../../types';
import { getFileIcon } from '../../utils';
import { useAppStore } from '../../store/useAppStore';
import { ArtifactTypeLabel } from '../../api/types';
import type { ArtifactTypeValue } from '../../api/types';
import MarkdownMessage from './MarkdownMessage';
import ThinkingPanel from './ThinkingPanel';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { setFormBuilderOpen, setReviewData, setProcessedFiles } = useAppStore();

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user';
    const isLoading = message.type === 'loading';
    const showLoadingDots = !isUser && (isLoading || (!message.content && !message.artifact && message.metadata?.isStreaming !== false));

    return (
      <div
        key={message.id}
        style={{
          display: 'flex',
          marginBottom: '24px',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          animation: 'fadeInUp 0.3s ease-out',
          width: '100%',
        }}
      >
        {isUser ? (
          /* User message — attachments above, text bubble below */
          <div
            style={{
              maxWidth: 'calc(100% - 16px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '6px',
            }}
          >
            {/* Attachment cards — above the bubble */}
            {message.attachments && message.attachments.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                {message.attachments.map((file) => {
                  const ext = file.name?.split('.').pop()?.toUpperCase() ?? 'FILE';
                  return (
                    <div
                      key={file.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: '#FFFDFA',
                        border: '1px solid #E4DFD5',
                        minWidth: '160px',
                        maxWidth: '220px',
                      }}
                    >
                      {/* File type icon block */}
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: '#F6ECE4',
                          border: '1px solid #E4C9B5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '16px',
                        }}
                      >
                        {getFileIcon(file.type)}
                      </div>
                      {/* Filename + extension stacked */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#3A3733',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {file.name ?? 'Unnamed file'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#8A8578', marginTop: '1px' }}>
                          {ext} File
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Text bubble */}
            {message.content && (
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: '18px',
                  borderBottomRightRadius: '4px',
                  background: '#F6ECE4',
                  color: '#3A3733',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  fontWeight: 450,
                }}
              >
                <MarkdownMessage content={message.content} isUser={isUser} isStreaming={false} />
              </div>
            )}
          </div>
        ) : (
          /* Agent message — bare, full width, renders directly on canvas */
          <div style={{ width: '100%', paddingLeft: '16px', paddingRight: '16px' }}>
            {showLoadingDots ? (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '4px 0' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#B7B0A3', animation: 'dotPulse 1.4s infinite ease-in-out' }} />
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#B7B0A3', animation: 'dotPulse 1.4s infinite ease-in-out 0.2s' }} />
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#B7B0A3', animation: 'dotPulse 1.4s infinite ease-in-out 0.4s' }} />
              </div>
            ) : (
              <>
                {message.thinkingProcess && (
                  <ThinkingPanel thinking={message.thinkingProcess} />
                )}

                <MarkdownMessage
                  content={message.content}
                  isUser={false}
                  isStreaming={message.metadata?.isStreaming === true}
                />

                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {message.attachments.map((file) => (
                      <div
                        key={file.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: '#F5F3EE',
                          border: '1px solid #E4DFD5',
                          fontSize: '12px',
                          color: '#6B665C',
                        }}
                      >
                        <FileOutlined style={{ fontSize: '14px' }} />
                        <span>{getFileIcon(file.type)} {file.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Artifact trigger */}
                {message.artifact && (
                  <div
                    onClick={() => {
                      const fields = message.artifact?.data?.fields;
                      if (fields) setReviewData(fields as ExtractedField[]);
                      setProcessedFiles(message.artifact?.processedFiles ?? null);
                      setFormBuilderOpen(true);
                    }}
                    style={{
                      marginTop: '12px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(188, 110, 78, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease, background 0.2s ease',
                      background: 'transparent',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(188, 110, 78, 0.06)';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(188, 110, 78, 0.45)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(188, 110, 78, 0.25)';
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #C67A54 0%, #A85E3E 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileSearchOutlined style={{ color: '#fff', fontSize: '15px' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: '#8A8578', lineHeight: '1.3' }}>Document</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#3A3733', lineHeight: '1.4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ArtifactTypeLabel[message.artifact.artifactType as ArtifactTypeValue] ?? 'Review Artifact'}
                      </div>
                    </div>
                    <ArrowRightOutlined style={{ color: '#BC6E4E', fontSize: '13px', flexShrink: 0 }} />
                  </div>
                )}
              </>
            )}
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
