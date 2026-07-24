import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownMessageProps {
  content: string;
  isUser: boolean;
  isStreaming?: boolean;
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  isUser,
  isStreaming = false,
}) => {
  return (
    <div
      style={{
        fontSize: '14px',
        color: isUser ? '#3A3733' : '#3A3733',
        lineHeight: '1.6',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Customize heading styles
          h1: ({ node, ...props }) => (
            <h1
              style={{
                fontSize: '1.5em',
                fontWeight: 'bold',
                marginTop: '0.5em',
                marginBottom: '0.5em',
                color: isUser ? '#3A3733' : '#2B2925',
              }}
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              style={{
                fontSize: '1.3em',
                fontWeight: 'bold',
                marginTop: '0.5em',
                marginBottom: '0.5em',
                color: isUser ? '#3A3733' : '#2B2925',
              }}
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              style={{
                fontSize: '1.15em',
                fontWeight: 'bold',
                marginTop: '0.5em',
                marginBottom: '0.5em',
                color: isUser ? '#3A3733' : '#2B2925',
              }}
              {...props}
            />
          ),
          // Customize paragraph
          p: ({ node, ...props }) => (
            <p
              style={{
                margin: '0.5em 0',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                textAlign: isUser ? 'left' : 'justify',
                hyphens: isUser ? 'none' : 'auto',
              }}
              {...props}
            />
          ),
          // Customize code blocks
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            return isInline ? (
              <code
                style={{
                  backgroundColor: isUser ? 'rgba(58, 55, 51, 0.08)' : '#F0ECE3',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                  color: isUser ? '#3A3733' : '#A85E3E',
                }}
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className={className}
                style={{
                  display: 'block',
                  backgroundColor: isUser ? 'rgba(58, 55, 51, 0.06)' : '#F5F2EC',
                  color: isUser ? '#3A3733' : '#2B2925',
                  padding: '12px',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                  margin: '0.5em 0',
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          // Customize pre (code block wrapper)
          pre: ({ node, ...props }) => (
            <pre
              style={{
                margin: '0.5em 0',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
              {...props}
            />
          ),
          // Customize lists
          ul: ({ node, ...props }) => (
            <ul
              style={{
                margin: '0.5em 0',
                paddingLeft: '1.5em',
                listStyleType: 'disc',
              }}
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              style={{
                margin: '0.5em 0',
                paddingLeft: '1.5em',
                listStyleType: 'decimal',
              }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              style={{
                margin: '0.25em 0',
                textAlign: isUser ? 'left' : 'justify',
                hyphens: isUser ? 'none' : 'auto',
              }}
              {...props}
            />
          ),
          // Customize links
          a: ({ node, ...props }) => (
            <a
              style={{
                color: isUser ? '#A85E3E' : '#BC6E4E',
                textDecoration: 'underline',
                fontWeight: '500',
              }}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // Customize blockquote
          blockquote: ({ node, ...props }) => (
            <blockquote
              style={{
                margin: '0.5em 0',
                paddingLeft: '1em',
                borderLeft: `3px solid ${isUser ? '#DDBBA6' : '#D6D0C4'}`,
                color: isUser ? '#6B665C' : '#8A8578',
                fontStyle: 'italic',
              }}
              {...props}
            />
          ),
          // Customize table
          table: ({ node, ...props }) => (
            <div style={{ overflowX: 'auto', margin: '0.5em 0' }}>
              <table
                style={{
                  borderCollapse: 'collapse',
                  width: '100%',
                  border: `1px solid ${isUser ? '#E4C9B5' : '#EDE9E1'}`,
                }}
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              style={{
                border: `1px solid ${isUser ? '#E4C9B5' : '#EDE9E1'}`,
                padding: '8px',
                backgroundColor: isUser ? '#F6ECE4' : '#F5F3EE',
                fontWeight: 'bold',
                textAlign: 'left',
              }}
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              style={{
                border: `1px solid ${isUser ? '#E4C9B5' : '#EDE9E1'}`,
                padding: '8px',
              }}
              {...props}
            />
          ),
          // Customize horizontal rule
          hr: ({ node, ...props }) => (
            <hr
              style={{
                border: 'none',
                borderTop: `1px solid ${isUser ? '#E4C9B5' : '#EDE9E1'}`,
                margin: '1em 0',
              }}
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Show smooth cursor for streaming messages */}
      {isStreaming && (
        <span
          className="streaming-cursor"
          style={{
            display: 'inline-block',
            width: '8px',
            height: '16px',
            backgroundColor: isUser ? '#3A3733' : '#BC6E4E',
            marginLeft: '3px',
            borderRadius: '2px',
            animation: 'smoothBlink 1.2s ease-in-out infinite',
            verticalAlign: 'text-bottom',
          }}
        />
      )}
      <style>{`
        @keyframes smoothBlink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default MarkdownMessage;
