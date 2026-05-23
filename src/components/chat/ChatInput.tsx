import React, { useState, useRef } from 'react';
import { Input, Button, Upload, Tag, message as antMessage } from 'antd';
import type { UploadProps } from 'antd';
import { SendOutlined, PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAppStore } from '../../store/useAppStore';
import { FILE_UPLOAD } from '../../constants';
import { formatFileSize, isValidFileSize, isValidFileType } from '../../utils';
import { useConversationStream } from '../../hooks/useConversationStream';

const { TextArea } = Input;

const ChatInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { activeConversationId } = useAppStore();
  const inputRef = useRef<any>(null);

  // Use the conversation stream hook
  const { sendMessage, isStreaming } = useConversationStream({
    onError: (err) => {
      antMessage.error(`Failed to send message: ${err.message}`);
    },
    onComplete: () => {
      console.log('Streaming completed');
    },
  });

  const handleSend = async () => {
    if (!inputValue.trim() && fileList.length === 0) return;
    if (!activeConversationId) return;
    if (isStreaming) return;

    const files: File[] = fileList
      .map((uploadFile) => uploadFile.originFileObj as File)
      .filter((file) => file !== undefined);

    const messageToSend = inputValue || 'Sent files';

    // Reset input optimistically before waiting for response
    setInputValue('');
    setFileList([]);
    inputRef.current?.focus();

    try {
      await sendMessage(activeConversationId, messageToSend, files);
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

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      // Validate file type
      if (!isValidFileType(file, [...FILE_UPLOAD.ALLOWED_TYPES])) {
        antMessage.error(`${file.name} is not a valid file type`);
        return Upload.LIST_IGNORE;
      }

      // Validate file size
      if (!isValidFileSize(file, FILE_UPLOAD.MAX_SIZE)) {
        antMessage.error(`${file.name} is too large. Maximum size is ${formatFileSize(FILE_UPLOAD.MAX_SIZE)}`);
        return Upload.LIST_IGNORE;
      }

      return false; // Prevent auto upload
    },
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    multiple: true,
    showUploadList: false,
  };

  const removeFile = (file: UploadFile) => {
    setFileList(fileList.filter((f) => f.uid !== file.uid));
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.10), 0 1px 4px rgba(0, 0, 0, 0.06)',
        padding: '12px 16px',
      }}
      >
        {/* File Preview Area */}
        {fileList.length > 0 && (
          <div
            style={{
              marginBottom: '10px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {fileList.map((file) => (
              <Tag
                key={file.uid}
                closable
                onClose={() => removeFile(file)}
                closeIcon={<CloseOutlined />}
                style={{
                  borderRadius: '12px',
                  padding: '4px 12px',
                }}
              >
                📎 {file.name} ({formatFileSize(file.size || 0)})
              </Tag>
            ))}
          </div>
        )}

        {/* Input Row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          {/* File Upload Button */}
          <Upload {...uploadProps}>
            <Button
              type="text"
              icon={<PaperClipOutlined style={{ fontSize: '18px' }} />}
              style={{ height: '40px', width: '40px', flexShrink: 0, color: '#8c8c8c' }}
              disabled={!activeConversationId}
            />
          </Upload>

          {/* Text Input */}
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
            disabled={!activeConversationId}
          />

          {/* Send Button */}
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!activeConversationId || (!inputValue.trim() && fileList.length === 0) || isStreaming}
            loading={isStreaming}
            style={{
              width: '40px',
              height: '40px',
              flexShrink: 0,
            }}
          />
        </div>
      </div>
  );
};

export default ChatInput;
