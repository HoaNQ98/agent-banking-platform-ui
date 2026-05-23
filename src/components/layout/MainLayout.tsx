import React, { useEffect } from 'react';
import { Layout, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import { LAYOUT } from '../../constants';
import { isMobileDevice } from '../../utils';
import { useConversationRoute } from '../../hooks/useConversationRoute';
import Sidebar from '../sidebar/Sidebar';
import ChatSection from '../chat/ChatSection';
import DocumentReviewPanel from '../form-builder/DocumentReview/DocumentReviewPanel';

const { Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  useConversationRoute();
  const { uiState, reviewData, setMobile, setSidebarOpen, toggleSidebar } = useAppStore();
  const { isSidebarOpen, isFormBuilderOpen, isMobile } = uiState;

  const isReviewOpen = isFormBuilderOpen && !!reviewData;

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobileDevice();
      setMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobile, setSidebarOpen]);

  // When review panel opens, close sidebar to give space
  useEffect(() => {
    if (isReviewOpen) setSidebarOpen(false);
  }, [isReviewOpen, setSidebarOpen]);

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
      <Layout style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
        {/* Sidebar */}
        {!isMobile && isSidebarOpen && !isReviewOpen && (
          <Sider
            width={LAYOUT.SIDEBAR_WIDTH}
            style={{
              background: '#fafafa',
              borderRight: '1px solid #f0f0f0',
              overflow: 'auto',
              flexShrink: 0,
            }}
          >
            <Sidebar />
          </Sider>
        )}

        {/* Mobile Sidebar overlay */}
        {isMobile && isSidebarOpen && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.45)',
                zIndex: 999,
              }}
              onClick={() => setSidebarOpen(false)}
            />
            <Sider
              width={LAYOUT.SIDEBAR_WIDTH}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                background: '#fafafa',
                borderRight: '1px solid #f0f0f0',
                overflow: 'auto',
                zIndex: 1000,
                boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
              }}
            >
              <Sidebar />
            </Sider>
          </>
        )}

        {/* Sidebar expand button — shown when sidebar is collapsed (desktop only) */}
        {!isMobile && !isSidebarOpen && !isReviewOpen && (
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            style={{
              position: 'fixed',
              top: '16px',
              left: '12px',
              zIndex: 50,
              color: '#8c8c8c',
              background: 'transparent',
            }}
          />
        )}

        {/* Mobile hamburger — shown when sidebar is closed */}
        {isMobile && !isSidebarOpen && (
          <Button
            type="text"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            style={{
              position: 'fixed',
              top: '12px',
              left: '12px',
              zIndex: 50,
              color: '#8c8c8c',
              fontSize: '18px',
              lineHeight: 1,
            }}
          >
            ☰
          </Button>
        )}

        {/* Chat — shrinks to 1/3 when review is open */}
        <Content
          style={{
            overflow: 'hidden',
            background: '#fafafa',
            flex: isReviewOpen ? '0 0 33%' : '1 1 0%',
            transition: 'flex 300ms ease',
            minWidth: 0,
          }}
        >
          <ChatSection />
        </Content>

        {/* Review panel — slides in from right, takes 2/3 */}
        <div
          style={{
            flex: isReviewOpen ? '0 0 67%' : '0 0 0%',
            overflow: 'hidden',
            borderLeft: isReviewOpen ? '1px solid #f0f0f0' : 'none',
            transform: isReviewOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'flex 300ms ease, transform 300ms ease',
            minWidth: 0,
          }}
        >
          {isReviewOpen && <DocumentReviewPanel />}
        </div>

      </Layout>
    </Layout>
  );
};

export default MainLayout;
