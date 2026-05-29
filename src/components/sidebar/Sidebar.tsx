import React, { useEffect, useRef, useCallback } from 'react';
import { Button, Typography } from 'antd';
import {
  PlusOutlined,
  MessageOutlined,
  LeftOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { PRIVILEGED_ROLES } from '../../constants';
import ConversationList from './ConversationList';
import ConversationSkeleton from './ConversationSkeleton';
import SidebarFooter from './SidebarFooter';

const { Title, Text } = Typography;

const SCROLL_THRESHOLD = 80;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    createConversation,
    remoteConversations,
    isLoadingConversations,
    conversationHasMore,
    fetchConversations,
    toggleSidebar,
  } = useAppStore();
  const { isLoggedIn, user } = useAuthStore();

  const canSeeEmails = isLoggedIn && user != null && PRIVILEGED_ROLES.includes(user.role);

  const isChatActive = location.pathname === '/' || location.pathname.startsWith('/c/');
  const isEmailsActive = location.pathname === '/emails';

  const handleNewConversation = () => {
    const id = createConversation();
    navigate(`/c/${id}`);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations(1);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isLoadingConversations || !conversationHasMore) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distanceFromBottom <= SCROLL_THRESHOLD) {
      fetchConversations();
    }
  }, [isLoadingConversations, conversationHasMore, fetchConversations]);

  const isEmpty = remoteConversations.length === 0 && !isLoadingConversations;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, #1890ff 0%, #13c2c2 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '11px' }}>BA</span>
          </div>
          <Title
            level={5}
            style={{ margin: 0, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            Banking Agent
          </Title>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <Button
            type="text"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={handleNewConversation}
            aria-label="New conversation"
            style={{ color: '#595959' }}
          />
          <Button
            type="text"
            shape="circle"
            icon={<LeftOutlined />}
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            style={{ color: '#595959' }}
          />
        </div>
      </div>

      {/* Scrollable body */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        {/* Features section */}
        <div style={{ padding: '16px 8px 8px' }}>
          <Text
            type="secondary"
            style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', padding: '0 8px', display: 'block', marginBottom: '4px' }}
          >
            Features
          </Text>

          <FeatureItem
            icon={<MessageOutlined />}
            label="Chat"
            active={isChatActive}
            onClick={() => navigate('/')}
          />

          {canSeeEmails && (
            <FeatureItem
              icon={<MailOutlined />}
              label="Emails"
              active={isEmailsActive}
              onClick={() => navigate('/emails')}
            />
          )}
        </div>

        {/* Recents section */}
        <div style={{ flex: 1, paddingTop: '8px' }}>
          <Text
            type="secondary"
            style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', padding: '0 16px', display: 'block', marginBottom: '4px' }}
          >
            Recents
          </Text>

          {remoteConversations.length === 0 && isLoadingConversations ? (
            <ConversationSkeleton count={8} />
          ) : isEmpty ? (
            null
          ) : (
            <>
              <ConversationList />
              {isLoadingConversations && <ConversationSkeleton count={3} />}
            </>
          )}
        </div>
      </div>

      <SidebarFooter />
    </div>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      background: active ? '#e6f4ff' : 'transparent',
      color: active ? '#1677ff' : '#262626',
      fontWeight: active ? 600 : 400,
      fontSize: '14px',
      transition: 'background-color 0.15s ease',
      textAlign: 'left',
      marginBottom: '2px',
    }}
    onMouseEnter={(e) => {
      if (!active) e.currentTarget.style.backgroundColor = '#f0f0f0';
    }}
    onMouseLeave={(e) => {
      if (!active) e.currentTarget.style.backgroundColor = 'transparent';
    }}
  >
    <span style={{ fontSize: '16px', display: 'flex', alignItems: 'center', color: active ? '#1677ff' : '#595959' }}>
      {icon}
    </span>
    {label}
  </button>
);

export default Sidebar;
