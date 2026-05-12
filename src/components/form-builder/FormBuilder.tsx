import React from 'react';
import { Typography, Button, Empty } from 'antd';
import { ArrowLeftOutlined, FormOutlined } from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import DynamicForm from './DynamicForm';

const { Title } = Typography;

const FormBuilder: React.FC = () => {
  const { currentForm, setFormBuilderOpen } = useAppStore();

  const handleClose = () => {
    setFormBuilderOpen(false);
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: '64px',
          background: '#e6f7ff',
          borderBottom: '2px solid #1890ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleClose}
          style={{ color: '#1890ff' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(24, 144, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Back
        </Button>

        <Title level={5} style={{ margin: 0, color: '#262626' }}>
          Form Builder
        </Title>

        <div style={{ width: '64px' }} /> {/* Spacer for centering */}
      </div>

      {/* Form Content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {currentForm ? (
          <DynamicForm form={currentForm} />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 24px',
            }}
          >
            <Empty
              image={<FormOutlined style={{ fontSize: 64, color: '#9CA3AF' }} />}
              description={
                <div style={{ textAlign: 'center' }}>
                  <Title level={4}>No Form Available</Title>
                  <Typography.Text type="secondary">
                    Forms will appear here when the agent extracts information from your documents or
                    requests.
                  </Typography.Text>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
