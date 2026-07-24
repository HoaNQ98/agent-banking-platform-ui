import React, { useState } from 'react';
import { Modal, Form, Input, Button, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CloseOutlined } from '@ant-design/icons';
import { AuthService } from '../../api/services/auth';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';

const { Text } = Typography;

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useAuthStore((s) => s.login);
  const fetchConversations = useAppStore((s) => s.fetchConversations);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const user = await AuthService.login(values);
      login(user);
      form.resetFields();
      onClose();
      fetchConversations(1);
    } catch (err: any) {
      setError(err.detail || err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={400}
      mask={{ closable: !loading }}
      // Disable the default Ant Design close button — we render our own
      closable={false}
      styles={{
        mask: { backdropFilter: 'blur(4px)', background: 'rgba(0, 0, 0, 0.5)' },
        content: { borderRadius: '20px', padding: 0, overflow: 'hidden' },
        body: { padding: 0 },
      }}
    >
      {/* Header band */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #A85E3E 0%, #C67A54 55%, #C9A05E 100%)',
          padding: '20px 24px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            width: '36px',
            height: '36px',
            background: 'rgba(255,255,255,0.2)',
            border: '1.5px solid rgba(255,255,255,0.45)',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 800, fontSize: '13px', letterSpacing: '-0.5px' }}>
            BA
          </span>
        </div>

        {/* Title + subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', lineHeight: 1.3 }}>
            Banking Agent
          </div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', marginTop: '1px' }}>
            Sign in to access your conversations
          </div>
        </div>

        {/* Close button — sits inside header, always visible on white */}
        {!loading && (
          <button
            onClick={handleClose}
            style={{
              flexShrink: 0,
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          >
            <CloseOutlined />
          </button>
        )}
      </div>

      {/* Form area */}
      <div style={{ padding: '20px 24px 22px' }}>
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: '14px', borderRadius: '7px', fontSize: '13px' }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label={<Text style={{ fontSize: '12px', fontWeight: 600, color: '#5C574E' }}>Username</Text>}
            rules={[{ required: true, message: 'Please enter your username' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#A8A296', fontSize: '13px' }} />}
              placeholder="Enter your username"
              autoComplete="username"
              style={{ borderRadius: '7px', height: '38px', fontSize: '14px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<Text style={{ fontSize: '12px', fontWeight: 600, color: '#5C574E' }}>Password</Text>}
            rules={[{ required: true, message: 'Please enter your password' }]}
            style={{ marginBottom: '16px' }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#A8A296', fontSize: '13px' }} />}
              placeholder="Enter your password"
              autoComplete="current-password"
              iconRender={(visible) => (visible ? <EyeTwoTone twoToneColor="#BC6E4E" /> : <EyeInvisibleOutlined />)}
              style={{ borderRadius: '7px', height: '38px', fontSize: '14px' }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: '38px',
              borderRadius: '7px',
              fontSize: '14px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, #A85E3E 0%, #C67A54 100%)',
              border: 'none',
              boxShadow: '0 3px 10px rgba(168, 94, 62, 0.28)',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </Form>

        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ flex: 1, height: '1px', background: '#E4DFD5' }} />
            <Text style={{ color: '#A8A296', fontSize: '11px' }}>or</Text>
            <div style={{ flex: 1, height: '1px', background: '#E4DFD5' }} />
          </div>
          <Button
            type="text"
            onClick={handleClose}
            disabled={loading}
            style={{ color: '#6B665C', fontSize: '12px', height: 'auto', padding: '2px 0' }}
          >
            Continue without signing in
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
