import React, { useState } from 'react';
import { Typography, Button, Tag } from 'antd';
import { CloseOutlined, WarningOutlined } from '@ant-design/icons';
import { useAppStore } from '../../../store/useAppStore';
import type { ActiveSource } from '../../../types';
import FieldReviewCard from './FieldReviewCard';
import PdfViewer from './PdfViewer';

const { Title, Text } = Typography;

const DocumentReviewPanel: React.FC = () => {
  const { reviewData, setReviewData, setFormBuilderOpen, setSidebarOpen } = useAppStore();
  const [activeSource, setActiveSource] = useState<ActiveSource | null>(null);
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);

  const handleClose = () => {
    setFormBuilderOpen(false);
    setReviewData(null);
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

        {/* Right: PDF viewer */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <PdfViewer activeSource={activeSource} />
        </div>
      </div>
    </div>
  );
};

export default DocumentReviewPanel;
