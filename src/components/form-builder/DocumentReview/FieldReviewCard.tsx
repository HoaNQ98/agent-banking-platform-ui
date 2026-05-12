import React, { useState } from 'react';
import { Tag, Typography, Button } from 'antd';
import {
  WarningOutlined,
  BulbOutlined,
  FileTextOutlined,
  ReadOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons';
import type { ExtractedField, ActiveSource, FieldStatus } from '../../../types';

const { Text } = Typography;

interface FieldReviewCardProps {
  field: ExtractedField;
  isActive: boolean;
  onSourceClick: (source: ActiveSource) => void;
}

const STATUS_CONFIG: Record<FieldStatus, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: 'Needs Attention', color: '#ff4d4f', bg: '#fff2f0' },
  WARNING:  { label: 'Review Suggested', color: '#faad14', bg: '#fffbe6' },
  INFO:     { label: 'Looks Good', color: '#52c41a', bg: '#f6ffed' },
};

function toLabel(camelCase: string): string {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function renderValue(val: unknown): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'object') {
    return Object.entries(val as Record<string, unknown>)
      .map(([k, v]) => `${toLabel(k)}: ${v}`)
      .join('  ·  ');
  }
  return String(val);
}

const FieldReviewCard: React.FC<FieldReviewCardProps> = ({ field, isActive, onSourceClick }) => {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[field.status];
  const hasIssue = !!field.issue;
  const totalSources = field.refDocuments.length + field.refRegulations.length;

  return (
    <div
      style={{
        border: `1px solid ${isActive ? config.color : '#e8e8e8'}`,
        borderLeft: `3px solid ${config.color}`,
        borderRadius: 8,
        background: '#fff',
        marginBottom: 12,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Card header — always visible */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text strong style={{ fontSize: 14 }}>
              {toLabel(field.fieldName)}
            </Text>
            <Tag
              style={{
                color: config.color,
                background: config.bg,
                border: `1px solid ${config.color}`,
                fontSize: 11,
                padding: '0 6px',
                borderRadius: 4,
              }}
            >
              {config.label}
            </Tag>
          </div>
          <Text style={{ fontSize: 13, color: '#595959' }}>{renderValue(field.fieldValue)}</Text>
        </div>

        <Button
          type="text"
          size="small"
          icon={expanded ? <UpOutlined /> : <DownOutlined />}
          onClick={() => setExpanded((v) => !v)}
          style={{ color: '#8c8c8c', flexShrink: 0 }}
        >
          {totalSources > 0 ? `${totalSources} source${totalSources > 1 ? 's' : ''}` : ''}
        </Button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '0 16px 14px' }}>
          {/* Issue */}
          {hasIssue && (
            <div
              style={{
                background: config.bg,
                border: `1px solid ${config.color}20`,
                borderRadius: 6,
                padding: '10px 12px',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <WarningOutlined style={{ color: config.color, marginTop: 2, flexShrink: 0 }} />
                <Text strong style={{ fontSize: 13, color: config.color }}>
                  Issue
                </Text>
              </div>
              <Text style={{ fontSize: 13, color: '#595959' }}>{field.issue}</Text>
            </div>
          )}

          {/* Recommendation */}
          {field.recommendation && (
            <div
              style={{
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: 6,
                padding: '10px 12px',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                <BulbOutlined style={{ color: '#1890ff', marginTop: 2, flexShrink: 0 }} />
                <Text strong style={{ fontSize: 13, color: '#1890ff' }}>
                  Suggestion
                </Text>
              </div>
              <Text style={{ fontSize: 13, color: '#595959' }}>{field.recommendation}</Text>
            </div>
          )}

          {/* Sources */}
          {totalSources > 0 && (
            <div>
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
                Sources — click to view in document
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {field.refDocuments.map((doc, i) =>
                  doc.bboxes.map((bbox, j) => (
                    <Tag
                      key={`doc-${i}-${j}`}
                      icon={<FileTextOutlined />}
                      color="default"
                      style={{ cursor: 'pointer', fontSize: 12 }}
                      onClick={() =>
                        onSourceClick({
                          docName: doc.docName,
                          pageIndex: bbox.pageIndex,
                          boxes: bbox.boxes,
                        })
                      }
                    >
                      {doc.docName}  p.{bbox.pageIndex + 1}
                    </Tag>
                  ))
                )}
                {field.refRegulations.map((reg, i) =>
                  reg.bboxes.map((bbox, j) => (
                    <Tag
                      key={`reg-${i}-${j}`}
                      icon={<ReadOutlined />}
                      color="processing"
                      style={{ cursor: 'pointer', fontSize: 12 }}
                      onClick={() =>
                        onSourceClick({
                          docName: reg.docName,
                          pageIndex: bbox.pageIndex,
                          boxes: bbox.boxes,
                        })
                      }
                    >
                      {reg.regulationCode}  {reg.sectionNumber}
                    </Tag>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldReviewCard;
