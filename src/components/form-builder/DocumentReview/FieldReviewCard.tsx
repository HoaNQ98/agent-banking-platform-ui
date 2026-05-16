import React from 'react';
import { Tag, Typography, Collapse } from 'antd';
import {
  WarningOutlined,
  BulbOutlined,
  FileTextOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import type { ExtractedField, ActiveSource, FieldStatus } from '../../../types';

const { Text } = Typography;

interface FieldReviewCardProps {
  field: ExtractedField;
  isActive: boolean;
  onSourceClick: (source: ActiveSource) => void;
}

const STATUS_CONFIG: Record<FieldStatus, { label: string; color: string; bg: string }> = {
  CRITICAL: { label: 'Must Fix',      color: '#ff4d4f', bg: '#fff2f0' },
  WARNING:  { label: 'Should Fix',    color: '#faad14', bg: '#fffbe6' },
  INFO:     { label: 'Best Practice', color: '#1890ff', bg: '#e6f7ff' },
  OK:       { label: 'No Issue',      color: '#52c41a', bg: '#f6ffed' },
};

function toLabel(camelCase: string): string {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function FieldValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return <Text type="secondary" style={{ fontSize: 13 }}>—</Text>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <Text type="secondary" style={{ fontSize: 13 }}>—</Text>;
    return (
      <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
        {value.map((item, i) => (
          <li key={i} style={{ fontSize: 13, color: '#262626', wordBreak: 'break-word', marginBottom: 2 }}>
            {String(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== null && v !== undefined);
    if (entries.length === 0) return <Text type="secondary" style={{ fontSize: 13 }}>—</Text>;
    return (
      <table style={{ marginTop: 4, borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {entries.map(([k, v]) => (
            <tr key={k}>
              <td style={{ paddingRight: 12, paddingBottom: 2, verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{toLabel(k)}</Text>
              </td>
              <td style={{ paddingBottom: 2 }}>
                <Text style={{ fontSize: 13, color: '#262626' }}>{String(v)}</Text>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <Text style={{ fontSize: 13, color: '#262626', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
      {String(value)}
    </Text>
  );
}

const FieldReviewCard: React.FC<FieldReviewCardProps> = ({ field, isActive, onSourceClick }) => {
  const config = STATUS_CONFIG[field.status];
  const refDocs = field.refDocuments ?? [];
  const refRegs = field.refRegulations ?? [];
  const totalSources = refDocs.length + refRegs.length;

  const hasDetails = !!field.issue || !!field.recommendation || totalSources > 0;

  const cardHeader = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text strong style={{ fontSize: 13 }}>{toLabel(field.fieldName)}</Text>
        {totalSources > 0 && (
          <Text type="secondary" style={{ fontSize: 11, marginLeft: 'auto', flexShrink: 0 }}>
            {totalSources} source{totalSources > 1 ? 's' : ''}
          </Text>
        )}
      </div>
      <FieldValue value={field.fieldValue} />
    </div>
  );

  const detailsContent = (
    <div style={{ paddingTop: 4 }}>
      {field.issue && (
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
            <Text strong style={{ fontSize: 13, color: config.color }}>Issue</Text>
          </div>
          <Text style={{ fontSize: 13, color: '#595959' }}>{field.issue}</Text>
        </div>
      )}

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
            <Text strong style={{ fontSize: 13, color: '#1890ff' }}>Suggestion</Text>
          </div>
          <Text style={{ fontSize: 13, color: '#595959' }}>{field.recommendation}</Text>
        </div>
      )}

      {totalSources > 0 && (
        <div>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
            Sources — click to view in document
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {refDocs.map((doc, i) =>
              (doc.bboxes ?? []).map((bbox, j) => (
                <Tag
                  key={`doc-${i}-${j}`}
                  icon={<FileTextOutlined />}
                  color="default"
                  style={{ cursor: 'pointer', fontSize: 12 }}
                  onClick={() =>
                    onSourceClick({ docName: doc.docName, pageIndex: bbox.pageIndex, boxes: bbox.boxes })
                  }
                >
                  {doc.docName} p.{bbox.pageIndex + 1}
                </Tag>
              ))
            )}
            {refRegs.map((reg, i) =>
              (reg.bboxes ?? []).map((bbox, j) => (
                <Tag
                  key={`reg-${i}-${j}`}
                  icon={<ReadOutlined />}
                  color="processing"
                  style={{ cursor: 'pointer', fontSize: 12 }}
                  onClick={() =>
                    onSourceClick({ docName: reg.docName, pageIndex: bbox.pageIndex, boxes: bbox.boxes })
                  }
                >
                  {reg.regulationCode} {reg.sectionNumber}
                </Tag>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ marginBottom: 12 }}>
      {hasDetails ? (
        <Collapse
          size="small"
          style={{
            borderLeft: `3px solid ${config.color}`,
            borderRadius: 8,
            background: '#fff',
            outline: isActive ? `1px solid ${config.color}` : undefined,
          }}
          items={[{ key: 'detail', label: cardHeader, children: detailsContent }]}
        />
      ) : (
        <div
          style={{
            border: '1px solid #e8e8e8',
            borderLeft: `3px solid ${config.color}`,
            borderRadius: 8,
            background: '#fff',
            padding: '12px 16px',
            outline: isActive ? `1px solid ${config.color}` : undefined,
          }}
        >
          {cardHeader}
        </div>
      )}
    </div>
  );
};

export default FieldReviewCard;
