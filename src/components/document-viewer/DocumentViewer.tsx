import React from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import PdfViewer from './PdfViewer';
import WordViewer from './WordViewer';

const { Text } = Typography;

export interface DocumentViewerProps {
  src: string;
  mimeType: string;
  label?: string;
  pageIndex?: number;
  highlights?: number[][];
}

const WORD_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const DocumentViewer: React.FC<DocumentViewerProps> = ({ src, mimeType, label, pageIndex, highlights }) => {
  if (mimeType === 'application/pdf') {
    return (
      <PdfViewer
        src={src}
        label={label}
        pageIndex={pageIndex}
        highlights={highlights}
      />
    );
  }

  if (WORD_MIME_TYPES.includes(mimeType) || mimeType.includes('word')) {
    return <WordViewer src={src} label={label} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid #EDE9E1',
          background: '#F5F3EE',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <FileTextOutlined style={{ color: '#8A8578' }} />
        <Text style={{ fontSize: 13, flex: 1 }} ellipsis>
          {label ?? src}
        </Text>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F0ECE3',
        }}
      >
        <div style={{ textAlign: 'center', color: '#B7B0A3' }}>
          <FileTextOutlined style={{ fontSize: 48, marginBottom: 12 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Preview not supported for this file type
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
