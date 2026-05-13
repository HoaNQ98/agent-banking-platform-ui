import React from 'react';
import { List, Typography, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../utils';
import type { ConversationItem } from '../../api/types';

const { Text } = Typography;

const ConversationList: React.FC = () => {
  const navigate = useNavigate();
  const {
    remoteConversations,
    activeConversationId,
    deleteConversation,
  } = useAppStore();

  const getMenuItems = (conversation: ConversationItem): MenuProps['items'] => [
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: 'Delete',
      danger: true,
      onClick: () => deleteConversation(conversation.id),
    },
  ];

  return (
    <List
      dataSource={remoteConversations}
      renderItem={(conversation) => {
        const isActive = conversation.id === activeConversationId;

        return (
          <List.Item
            onClick={() => navigate(`/c/${conversation.id}`)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              borderLeft: isActive ? '3px solid #1890ff' : '3px solid transparent',
              backgroundColor: isActive ? '#e6f7ff' : 'transparent',
              transition: 'all 0.3s',
              borderRadius: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <div style={{ flex: 1, minWidth: 0, marginRight: '8px' }}>
                {/* Active indicator + first message as title */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}
                >
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
                    {conversation.firstMessage}
                  </Text>
                </div>

                {/* Timestamp */}
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {formatRelativeTime(
                    new Date(conversation.updatedAt ?? conversation.createdAt)
                  )}
                </Text>
              </div>

              {/* Actions menu */}
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
