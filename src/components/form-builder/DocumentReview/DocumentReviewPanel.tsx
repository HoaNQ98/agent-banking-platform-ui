import React, { useState } from 'react';
import { Typography, Button, Tag } from 'antd';
import { CloseOutlined, WarningOutlined } from '@ant-design/icons';
import { useAppStore } from '../../../store/useAppStore';
import type { ActiveSource } from '../../../types';
import { getRegulationPath } from '../../../constants';
import FieldReviewCard from './FieldReviewCard';
import { DocumentViewer } from '../../document-viewer';

const { Title, Text } = Typography;

const DocumentReviewPanel: React.FC = () => {
  const { reviewData, processedFiles, setReviewData, setProcessedFiles, setFormBuilderOpen, setSidebarOpen } = useAppStore();
  const [activeSource, setActiveSource] = useState<ActiveSource | null>(null);
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);

  const handleClose = () => {
    setFormBuilderOpen(false);
    setReviewData(null);
    setProcessedFiles(null);
    setSidebarOpen(true);
    setActiveSource(null);
    setActiveFieldIndex(null);
  };

  const handleSourceClick = (source: ActiveSource, fieldIndex: number) => {
    setActiveSource(source);
    setActiveFieldIndex(fieldIndex);
  };

  if (!reviewData) return null;

  const criticalCount = reviewData.filter((f) => f.status === 'CRITICAL').length;
  const warningCount = reviewData.filter((f) => f.status === 'WARNING').length;
  const issueCount = criticalCount + warningCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* Panel header */}
      <div
        style={{
          height: 56,
          borderBottom: '1px solid #f0f0f0',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Title level={5} style={{ margin: 0 }}>
            Document Review
          </Title>
          {issueCount > 0 ? (
            <Tag
              icon={<WarningOutlined />}
              color="warning"
              style={{ fontSize: 12 }}
            >
              {issueCount} item{issueCount > 1 ? 's' : ''} to review
            </Tag>
          ) : (
            <Tag color="success" style={{ fontSize: 12 }}>
              All clear
            </Tag>
          )}
        </div>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleClose}
          style={{ color: '#8c8c8c' }}
        />
      </div>

      {/* Two-pane body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: field list */}
        <div
          style={{
            width: '42%',
            borderRight: '1px solid #f0f0f0',
            overflowY: 'auto',
            padding: '16px',
            flexShrink: 0,
          }}
        >
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
            {reviewData.length} field{reviewData.length > 1 ? 's' : ''} extracted
          </Text>
          {reviewData.map((field, i) => (
            <FieldReviewCard
              key={field.fieldName}
              field={field}
              isActive={activeFieldIndex === i}
              onSourceClick={(source) => handleSourceClick(source, i)}
            />
          ))}
        </div>

        {/* Right: document viewer */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {activeSource?.sourceType === 'regulation' && (() => {
            const path = getRegulationPath(activeSource.docName);
            return path ? (
              <DocumentViewer
                src={path}
                mimeType="application/pdf"
                label={activeSource.docName}
                pageIndex={activeSource.pageIndex}
                highlights={activeSource.boxes}
              />
            ) : (
              <div style={{ padding: 24, color: '#ff4d4f', fontSize: 13 }}>
                No registered path for &quot;{activeSource.docName}&quot;
              </div>
            );
          })()}
          {activeSource?.sourceType === 'document' && (() => {
            const file = processedFiles?.find((f) => f.docName === activeSource.docName)
              ?? processedFiles?.find((f) => f.isMain);
            return file ? (
              <DocumentViewer
                src={file.docDownloadUrl ?? file.docPath}
                mimeType={file.mimeType}
                label={file.docName}
                pageIndex={activeSource.pageIndex}
                highlights={activeSource.boxes}
              />
            ) : (
              <div style={{ padding: 24, color: '#ff4d4f', fontSize: 13 }}>
                Document not found: &quot;{activeSource.docName}&quot;
              </div>
            );
          })()}
          {!activeSource && (() => {
            const mainFile = processedFiles?.find((f) => f.isMain) ?? processedFiles?.[0];
            return mainFile ? (
              <DocumentViewer
                src={mainFile.docDownloadUrl ?? mainFile.docPath}
                mimeType={mainFile.mimeType}
                label={mainFile.docName}
              />
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                <div style={{ textAlign: 'center', color: '#bfbfbf' }}>
                  <div style={{ fontSize: 13 }}>Click a source tag on the left to view the document</div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewPanel;
