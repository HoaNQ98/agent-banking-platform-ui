import React from 'react';
import { Layout, Button } from 'antd';
import { MenuOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import { LAYOUT } from '../../constants';
import { useSampleFormData } from '../../hooks/useSampleData';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { toggleSidebar, toggleFormBuilder, uiState, setFormBuilderOpen } = useAppStore();
  const { isSidebarOpen, isFormBuilderOpen, isMobile } = uiState;
  const { generateSampleLoanForm, setCurrentForm } = useSampleFormData();

  const handleDemoForm = () => {
    const sampleForm = generateSampleLoanForm();
    setCurrentForm(sampleForm);
    setFormBuilderOpen(true);
  };

  return (
    <AntHeader
      style={{
        height: `${LAYOUT.HEADER_HEIGHT}px`,
        lineHeight: 'normal',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left Section - Sidebar Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px' }}>
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 20 }} />}
          onClick={toggleSidebar}
          style={{
            padding: '8px',
            borderRadius: '6px',
            backgroundColor: isSidebarOpen ? '#e6f7ff' : 'transparent',
            color: isSidebarOpen ? '#1890ff' : '#595959',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (!isSidebarOpen) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSidebarOpen) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          aria-label="Toggle sidebar"
        />

        {/* Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #1890ff 0%, #13c2c2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>BA</span>
          </div>
          {!isMobile && (
            <h1
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#262626',
                margin: 0,
              }}
            >
              Banking Agent Assistant
            </h1>
          )}
        </div>
      </div>

      {/* Right Section - Form Builder Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
        {/* Demo Form Button */}
        {!isMobile && (
          <Button onClick={handleDemoForm} type="default">
            Demo Form
          </Button>
        )}

        {/* Security Badge */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#595959',
            }}
          >
            <span style={{ color: '#52c41a' }}>🔒</span>
            <span>Secure & Encrypted</span>
          </div>
        )}

        {/* Form Builder Toggle */}
        <Button
          type="text"
          icon={<FileTextOutlined style={{ fontSize: 18 }} />}
          onClick={toggleFormBuilder}
          style={{
            padding: isMobile ? '8px' : '8px 12px',
            borderRadius: '6px',
            backgroundColor: isFormBuilderOpen ? '#e6f7ff' : 'transparent',
            color: isFormBuilderOpen ? '#1890ff' : '#595959',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (!isFormBuilderOpen) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseLeave={(e) => {
            if (!isFormBuilderOpen) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          aria-label="Toggle form builder"
        >
          {!isMobile && <span style={{ fontSize: '14px' }}>Form Builder</span>}
        </Button>
      </div>
    </AntHeader>
  );
};

export default Header;
