import React from 'react';
import { Avatar, Badge, Typography } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';

const { Text } = Typography;

const ChatHeader: React.FC = () => {
  const { agentInfo } = useAppStore();
  const { name, status } = agentInfo;

  const statusColor = status === 'online' ? '#10B981' : status === 'typing' ? '#F59E0B' : '#9CA3AF';

  return (
    <div
      style={{
        height: '64px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      <Badge dot status="processing" color={statusColor} offset={[-5, 35]}>
        <Avatar
          size={40}
          icon={<RobotOutlined />}
          style={{
            background: 'linear-gradient(135deg, #1890ff 0%, #13c2c2 100%)',
          }}
        />
      </Badge>

      <div style={{ marginLeft: '12px' }}>
        <Text strong style={{ fontSize: '15px', display: 'block' }}>
          {name}
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: statusColor,
            }}
          />
          <Text
            type="secondary"
            style={{
              fontSize: '13px',
              textTransform: 'capitalize',
            }}
          >
            {status}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
