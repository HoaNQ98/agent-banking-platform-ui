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
        borderTop: '1px solid #f0f0f0',
        padding: '16px 24px',
      }}
    >
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        {/* File Preview Area */}
        {fileList.length > 0 && (
          <div
            style={{
              marginBottom: '12px',
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

        {/* Input Area */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          {/* File Upload Button */}
          <Upload {...uploadProps}>
            <Button
              icon={<PaperClipOutlined />}
              size="large"
              style={{ height: '56px', flexShrink: 0 }}
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
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{
              fontSize: '14px',
              borderRadius: '24px',
              border: '2px solid #f0f0f0',
              resize: 'none',
              minHeight: '56px',
              paddingTop: '16px',
              paddingBottom: '16px',
            }}
            disabled={!activeConversationId}
          />

          {/* Send Button */}
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!activeConversationId || (!inputValue.trim() && fileList.length === 0) || isStreaming}
            loading={isStreaming}
            style={{
              width: '56px',
              height: '56px',
              flexShrink: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
