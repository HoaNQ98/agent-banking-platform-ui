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
      style={{ padding: '8px' }}
      dataSource={remoteConversations}
      renderItem={(conversation) => {
        const isActive = conversation.id === activeConversationId;

        return (
          <List.Item
            onClick={() => navigate(`/c/${conversation.id}`)}
            style={{
              padding: '10px 12px',
              cursor: 'pointer',
              borderRadius: '10px',
              backgroundColor: isActive ? '#F3E7DF' : 'transparent',
              border: 'none',
              marginBottom: '2px',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = '#ECE7DD';
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
                <Text
                  strong={isActive}
                  title={conversation.firstMessage}
                  style={{
                    color: isActive ? '#BC6E4E' : '#3A3733',
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                >
                  {conversation.firstMessage}
                </Text>

                {/* Timestamp */}
                <Text type="secondary" style={{ fontSize: '11px', marginTop: '2px', display: 'block' }}>
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
