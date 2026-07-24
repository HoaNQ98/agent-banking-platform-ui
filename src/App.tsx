import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './components/layout/MainLayout';
import EmailsPage from './components/emails/EmailsPage';

// Ant Design theme configuration — warm clay palette (Claude-like)
const theme = {
  token: {
    colorPrimary: '#BC6E4E',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#DC2626',
    colorInfo: '#3B82F6',
    colorTextBase: '#3A3733',
    colorBgBase: '#FFFFFF',
    colorBorder: '#E4DFD5',
    colorBorderSecondary: '#EDE9E1',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 14,
    borderRadius: 8,
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 8,
      primaryShadow: '0 2px 0 rgba(188, 110, 78, 0.1)',
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Select: {
      controlHeight: 40,
      borderRadius: 8,
    },
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={theme}>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/c/:conversationId" element={<MainLayout />} />
        <Route path="/emails" element={<MainLayout contentOverride={<EmailsPage />} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
