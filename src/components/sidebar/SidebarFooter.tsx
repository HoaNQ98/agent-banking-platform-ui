import React from 'react';
import { Divider, Button, Avatar, Typography, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const { Text } = Typography;

const SidebarFooter: React.FC = () => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => console.log('Profile clicked'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => console.log('Settings clicked'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => console.log('Logout clicked'),
    },
  ];

  return (
    <>
      <Divider style={{ margin: 0 }} />
      <div style={{ padding: '12px' }}>
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="topRight">
          <Button
            type="text"
            style={{
              width: '100%',
              height: 'auto',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Avatar
              size={40}
              icon={<UserOutlined />}
              style={{
                background: 'linear-gradient(135deg, #1890ff 0%, #13c2c2 100%)',
              }}
            />
            <div style={{ marginLeft: '12px', textAlign: 'left', flex: 1 }}>
              <Text strong style={{ fontSize: '14px', display: 'block' }}>
                User Profile
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                View settings
              </Text>
            </div>
            <SettingOutlined style={{ color: '#bfbfbf' }} />
          </Button>
        </Dropdown>
      </div>
    </>
  );
};

export default SidebarFooter;
