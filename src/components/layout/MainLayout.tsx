import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useAppStore } from '../../store/useAppStore';
import { LAYOUT } from '../../constants';
import { isMobileDevice } from '../../utils';
import { useConversationRoute } from '../../hooks/useConversationRoute';
import Sidebar from '../sidebar/Sidebar';
import ChatSection from '../chat/ChatSection';
import DocumentReviewPanel from '../form-builder/DocumentReview/DocumentReviewPanel';
import Header from './Header';

const { Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  useConversationRoute();
  const { uiState, reviewData, setMobile, setSidebarOpen } = useAppStore();
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
      <Header />

      <Layout style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
        {/* Sidebar */}
        {!isMobile && isSidebarOpen && !isReviewOpen && (
          <Sider
            width={LAYOUT.SIDEBAR_WIDTH}
            style={{
              background: '#fff',
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
                top: LAYOUT.HEADER_HEIGHT,
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
                top: LAYOUT.HEADER_HEIGHT,
                left: 0,
                bottom: 0,
                background: '#fff',
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

        {/* Chat — shrinks to 1/3 when review is open */}
        <Content
          style={{
            overflow: 'hidden',
            background: '#f5f5f5',
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
