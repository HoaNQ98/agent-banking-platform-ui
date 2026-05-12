import React from 'react';
import { Button, Typography, Empty } from 'antd';
import { PlusOutlined, MessageOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import ConversationList from './ConversationList';
import SidebarFooter from './SidebarFooter';

const { Title, Text } = Typography;

const Sidebar: React.FC = () => {
  const { createConversation, conversations } = useAppStore();

  const handleNewConversation = () => {
    createConversation();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      {/* Sidebar Header */}
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

      {/* Conversation List - Scrollable */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {conversations.length === 0 ? (
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
          <ConversationList />
        )}
      </div>

      {/* Sidebar Footer */}
      <SidebarFooter />
    </div>
  );
};

export default Sidebar;
