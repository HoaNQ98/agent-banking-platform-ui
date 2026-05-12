import React from 'react';
import { List, Typography, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../utils';
import type { Conversation } from '../../types';

const { Text } = Typography;

const ConversationList: React.FC = () => {
  const { conversations, activeConversationId, setActiveConversation, deleteConversation } =
    useAppStore();

  const handleConversationClick = (id: string) => {
    setActiveConversation(id);
  };

  const getMenuItems = (conversation: Conversation): MenuProps['items'] => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: 'Rename',
      onClick: () => {
        // TODO: Implement rename functionality
        console.log('Rename conversation:', conversation.id);
      },
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      danger: true,
      onClick: () => {
        deleteConversation(conversation.id);
      },
    },
  ];

  return (
    <List
      dataSource={conversations}
      renderItem={(conversation) => {
        const isActive = conversation.id === activeConversationId;

        return (
          <List.Item
            onClick={() => handleConversationClick(conversation.id)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderLeft: isActive ? '3px solid #1890ff' : '3px solid transparent',
              backgroundColor: isActive ? '#e6f7ff' : 'transparent',
              transition: 'all 0.3s',
              borderRadius: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                {/* Conversation Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  {isActive && (
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#1890ff',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <Text
                    strong
                    style={{
                      color: isActive ? '#1890ff' : '#262626',
                      fontSize: '14px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {conversation.title}
                  </Text>
                </div>

                {/* Last Message Preview */}
                {conversation.lastMessage && (
                  <Text
                    type="secondary"
                    style={{
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {conversation.lastMessage}
                  </Text>
                )}

                {/* Timestamp */}
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {formatRelativeTime(conversation.timestamp)}
                </Text>
              </div>

              {/* Actions Menu */}
              <Dropdown
                menu={{ items: getMenuItems(conversation) }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  size="small"
                  icon={<MoreOutlined />}
                  onClick={(e) => e.stopPropagation()}
                  style={{ flexShrink: 0 }}
                />
              </Dropdown>
            </div>
          </List.Item>
        );
      }}
    />
  );
};

export default ConversationList;
