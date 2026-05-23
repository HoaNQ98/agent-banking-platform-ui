import React, { useState } from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useAppStore } from '../../../store/useAppStore';
import type { ActiveSource } from '../../../types';
import { getRegulationPath } from '../../../constants';
import FieldReviewCard from './FieldReviewCard';
import { DocumentViewer } from '../../document-viewer';

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fafafa' }}>
      {/* Header */}
      <div
        style={{
          height: 44,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#262626' }}>Document Review</span>
          <span style={{ fontSize: 12, color: issueCount > 0 ? '#fa8c16' : '#52c41a' }}>
            · {issueCount > 0 ? `${issueCount} issue${issueCount > 1 ? 's' : ''}` : 'All clear'}
          </span>
        </div>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined style={{ fontSize: 12 }} />}
          onClick={handleClose}
          style={{ color: '#8c8c8c' }}
        />
      </div>

      {/* Two-pane body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: field list — scrollable, padded so cards float */}
        <div
          style={{
            width: '42%',
            borderRight: '1px solid #f0f0f0',
            overflowY: 'auto',
            padding: '12px 10px',
            flexShrink: 0,
            background: '#fafafa',
          }}
        >
          <span style={{ fontSize: 11, color: '#bfbfbf', display: 'block', marginBottom: 10, paddingLeft: 4 }}>
            {reviewData.length} field{reviewData.length > 1 ? 's' : ''} extracted
          </span>
          {reviewData.map((field, i) => (
            <FieldReviewCard
              key={field.fieldName}
              field={field}
              isActive={activeFieldIndex === i}
              onSourceClick={(source) => handleSourceClick(source, i)}
            />
          ))}
        </div>

        {/* Right: document viewer — rounded inset */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '10px', background: '#fafafa' }}>
          <div style={{ height: '100%', borderRadius: 12, overflow: 'hidden', background: '#fff', border: '1px solid #f0f0f0' }}>
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
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, color: '#bfbfbf' }}>
                    Click a source tag to view the document
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentReviewPanel;
