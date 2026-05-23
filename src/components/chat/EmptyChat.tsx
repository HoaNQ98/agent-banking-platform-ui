import React, { useState, useRef } from 'react';
import { Button, Input, Upload, Tag, message as antMessage } from 'antd';
import type { UploadProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { SendOutlined, PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useConversationStream } from '../../hooks/useConversationStream';
import { QUICK_SUGGESTIONS, FILE_UPLOAD } from '../../constants';
import { formatFileSize, isValidFileSize, isValidFileType } from '../../utils';

const { TextArea } = Input;

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const EmptyChat: React.FC = () => {
  const navigate = useNavigate();
  const { createConversation } = useAppStore();
  const { sendMessage, isStreaming } = useConversationStream({
    onError: (err) => antMessage.error(`Failed to send message: ${err.message}`),
  });

  const [inputValue, setInputValue] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const inputRef = useRef<any>(null);

  const handleSend = async (text?: string) => {
    const messageToSend = (text ?? inputValue).trim();
    if (!messageToSend && fileList.length === 0) return;
    if (isStreaming) return;

    const id = createConversation();
    navigate(`/c/${id}`);

    const files: File[] = fileList
      .map((f) => f.originFileObj as File)
      .filter(Boolean);

    setInputValue('');
    setFileList([]);

    try {
      await sendMessage(id, messageToSend || 'Sent files', files);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeFile = (file: UploadFile) => {
    setFileList(fileList.filter((f) => f.uid !== file.uid));
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      if (!isValidFileType(file, [...FILE_UPLOAD.ALLOWED_TYPES])) {
        antMessage.error(`${file.name} is not a valid file type`);
        return Upload.LIST_IGNORE;
      }
      if (!isValidFileSize(file, FILE_UPLOAD.MAX_SIZE)) {
        antMessage.error(`${file.name} is too large. Maximum size is ${formatFileSize(FILE_UPLOAD.MAX_SIZE)}`);
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    multiple: true,
    showUploadList: false,
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
        padding: '0 24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '800px' }}>
        {/* Greeting */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              margin: '0 0 10px',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #1677ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.5px',
            }}
          >
            {getGreeting()}
          </h1>
          <p style={{ fontSize: '15px', color: '#8c8c8c', margin: 0, fontWeight: 400 }}>
            How can I help you today?
          </p>
        </div>

        {/* Quick starters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '10px',
            marginBottom: '32px',
          }}
        >
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSend(s.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1.5px solid #e8e8e8',
                background: '#fff',
                color: '#595959',
                fontSize: '13px',
                fontWeight: 450,
                cursor: 'pointer',
                textAlign: 'left',
                lineHeight: '1.5',
                transition: 'all 0.15s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = '#91caff';
                el.style.color = '#1677ff';
                el.style.background = '#f0f7ff';
                el.style.boxShadow = '0 2px 8px rgba(22,119,255,0.1)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.borderColor = '#e8e8e8';
                el.style.color = '#595959';
                el.style.background = '#fff';
                el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
              }}
            >
              <span style={{ fontSize: '16px', lineHeight: 1 }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
            padding: '12px 16px',
          }}
        >
          {fileList.length > 0 && (
            <div style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {fileList.map((file) => (
                <Tag
                  key={file.uid}
                  closable
                  onClose={() => removeFile(file)}
                  closeIcon={<CloseOutlined />}
                  style={{ borderRadius: '12px', padding: '4px 12px' }}
                >
                  📎 {file.name} ({formatFileSize(file.size || 0)})
                </Tag>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <Upload {...uploadProps}>
              <Button
                type="text"
                icon={<PaperClipOutlined style={{ fontSize: '18px' }} />}
                style={{ height: '40px', width: '40px', flexShrink: 0, color: '#8c8c8c' }}
              />
            </Upload>
            <TextArea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              autoSize={{ minRows: 1, maxRows: 6 }}
              style={{
                fontSize: '14px',
                border: 'none',
                boxShadow: 'none',
                resize: 'none',
                padding: '8px 4px',
                background: 'transparent',
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<SendOutlined />}
              onClick={() => handleSend()}
              disabled={!inputValue.trim() && fileList.length === 0}
              loading={isStreaming}
              style={{ width: '40px', height: '40px', flexShrink: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;
