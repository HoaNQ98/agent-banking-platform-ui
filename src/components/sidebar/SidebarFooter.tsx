import React, { useState } from 'react';
import { Divider, Button, Avatar, Typography, Dropdown, notification } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, SettingOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { AuthService } from '../../api/services/auth';
import LoginModal from '../auth/LoginModal';

const { Text } = Typography;

const SidebarFooter: React.FC = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const navigate = useNavigate();
  const [notifApi, notifContextHolder] = notification.useNotification();
  const { user, isLoggedIn, logout } = useAuthStore();
  const { reset: resetAppStore, fetchConversations } = useAppStore();

  const handleLogout = async () => {
    try {
      const res = await AuthService.logout();
      notifApi.success({
        message: 'Signed out',
        description: res.message || 'You have been signed out successfully.',
        placement: 'topRight',
        duration: 3,
      });
    } catch (err: any) {
      notifApi.error({
        message: 'Logout failed',
        description: err.detail || err.message || 'Could not sign out from the server.',
        placement: 'topRight',
        duration: 4,
      });
    } finally {
      logout();           // clear auth store + localStorage
      resetAppStore();    // clear conversations, messages, active id
      navigate('/', { replace: true });
      fetchConversations(1); // reload as guest (no token in localStorage anymore)
    }
  };

  const loggedInMenuItems: MenuProps['items'] = [
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
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const guestMenuItems: MenuProps['items'] = [
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: 'Login',
      onClick: () => setLoginOpen(true),
    },
  ];

  const displayName = isLoggedIn && user ? user.firstName : 'User Profile';
  const displaySub = isLoggedIn && user ? user.role : 'View settings';
  const menuItems = isLoggedIn ? loggedInMenuItems : guestMenuItems;

  return (
    <>
      {notifContextHolder}
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
              e.currentTarget.style.backgroundColor = '#ECE7DD';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Avatar
              size={40}
              style={{
                background: isLoggedIn
                  ? 'linear-gradient(135deg, #A85E3E 0%, #B0894A 100%)'
                  : 'linear-gradient(135deg, #C67A54 0%, #C9A05E 100%)',
                fontSize: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {isLoggedIn ? '🐶' : <UserOutlined />}
            </Avatar>
            <div style={{ marginLeft: '12px', textAlign: 'left', flex: 1, minWidth: 0 }}>
              <Text
                strong
                style={{
                  fontSize: '14px',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {displayName}
              </Text>
              <Text
                type="secondary"
                style={{
                  fontSize: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {displaySub}
              </Text>
            </div>
            <SettingOutlined style={{ color: '#B7B0A3', flexShrink: 0 }} />
          </Button>
        </Dropdown>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default SidebarFooter;
