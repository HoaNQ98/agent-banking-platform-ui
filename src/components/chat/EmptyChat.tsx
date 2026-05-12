import React from 'react';
import { Button, Typography } from 'antd';
import { RobotOutlined, PlusOutlined, FileSearchOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import { CONVERSATION_STARTERS } from '../../constants';
import sampleReviewData from '../../data/sampleReviewData';

const { Title, Text } = Typography;

const EmptyChat: React.FC = () => {
  const { createConversation, setReviewData, setFormBuilderOpen } = useAppStore();

  const handleOpenReviewDemo = () => {
    setReviewData(sampleReviewData);
    setFormBuilderOpen(true);
  };

  const handleStarterClick = (_starter: string) => {
    createConversation();
    // After creating conversation, we could auto-fill the input with the starter text
    // This would require additional state management or a callback
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '672px',
          padding: '0 24px',
        }}
      >
        {/* Robot Avatar */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              width: '96px',
              height: '96px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, #1890ff 0%, #13c2c2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            }}
          >
            <RobotOutlined style={{ fontSize: 48, color: 'white' }} />
          </div>
        </div>

        {/* Welcome Message */}
        <Title level={2} style={{ marginBottom: '16px' }}>
          Hi! I'm your Banking Assistant
        </Title>

        <Text
          type="secondary"
          style={{
            fontSize: '16px',
            display: 'block',
            marginBottom: '48px',
          }}
        >
          How can I help you today?
        </Text>

        {/* Conversation Starters */}
        <div style={{ width: '100%' }}>
          <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '16px' }}>
            Quick Actions:
          </Text>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '32px',
            }}
          >
            {CONVERSATION_STARTERS.map((starter) => (
              <Button
                key={starter}
                type="default"
                size="large"
                onClick={() => handleStarterClick(starter)}
                style={{ borderRadius: '8px' }}
              >
                • {starter}
              </Button>
            ))}
          </div>

          {/* New Conversation Button */}
          <div style={{ marginTop: '48px', display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={createConversation}
              style={{ borderRadius: '8px', height: '48px', padding: '0 32px' }}
            >
              Start New Conversation
            </Button>
            <Button
              size="large"
              icon={<FileSearchOutlined />}
              onClick={handleOpenReviewDemo}
              style={{ borderRadius: '8px', height: '48px', padding: '0 32px' }}
            >
              Demo: Review Extracted Data
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div
          style={{
            marginTop: '48px',
            paddingTop: '48px',
            borderTop: '1px solid #f0f0f0',
          }}
        >
          <Text type="secondary" style={{ fontSize: '13px' }}>
            🔒 FDIC Insured | Secure | Encrypted
          </Text>
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;
