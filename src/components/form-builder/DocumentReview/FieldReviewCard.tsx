import React from 'react';
import { Tag, Typography, Collapse, Tooltip } from 'antd';
import {
  WarningOutlined,
  BulbOutlined,
  FileTextOutlined,
  ReadOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import type { ExtractedField, ActiveSource, FieldStatus } from '../../../types';
import { FIELD_LABELS } from '../../../constants/fieldLabels';

const { Text } = Typography;

interface FieldReviewCardProps {
  field: ExtractedField;
  isActive: boolean;
  onSourceClick: (source: ActiveSource) => void;
}

const STATUS_CONFIG: Record<FieldStatus, { label: string; color: string; bg: string; pillBg: string }> = {
  CRITICAL: { label: 'Must Fix',      color: '#ff4d4f', bg: '#fff2f0', pillBg: '#ff4d4f' },
  WARNING:  { label: 'Should Fix',    color: '#faad14', bg: '#fffbe6', pillBg: '#faad14' },
  INFO:     { label: 'Best Practice', color: '#1890ff', bg: '#e6f7ff', pillBg: '#1890ff' },
  OK:       { label: 'No Issue',      color: '#52c41a', bg: '#f6ffed', pillBg: '#52c41a' },
};

function toLabel(camelCase: string): string {
  if (FIELD_LABELS[camelCase]) return FIELD_LABELS[camelCase];
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

const MAX_LABEL_CHARS = 40;

function FieldLabel({ name, style }: { name: string; style?: React.CSSProperties }) {
  const label = toLabel(name);
  if (label.length <= MAX_LABEL_CHARS) {
    return <span style={style}>{label}</span>;
  }
  const truncated = label.slice(0, MAX_LABEL_CHARS) + '…';
  return (
    <Tooltip title={label} placement="top">
      <span style={{ ...style, cursor: 'default' }}>{truncated}</span>
    </Tooltip>
  );
}

function FieldValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return <Text type="secondary" style={{ fontSize: 13 }}>—</Text>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <Text type="secondary" style={{ fontSize: 13 }}>—</Text>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 2 }}>
        {value.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace', lineHeight: '20px', flexShrink: 0, userSelect: 'none' }}>
              [{i + 1}]
            </Text>
            <Text style={{ fontSize: 13, color: '#262626', wordBreak: 'break-word', lineHeight: '20px', textAlign: 'justify', hyphens: 'auto' } as React.CSSProperties}>
              {String(item)}
            </Text>
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, v]) => v !== null && v !== undefined);
    if (entries.length === 0) return <Text type="secondary" style={{ fontSize: 13 }}>—</Text>;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
        {entries.map(([k, v]) => (
          <div key={k}>
            <FieldLabel name={k} style={{ fontSize: 11, display: 'block', marginBottom: 2, color: '#8c8c8c' }} />
            <div style={{ fontSize: 13, color: '#262626', textAlign: 'justify', hyphens: 'auto', wordBreak: 'break-word' } as React.CSSProperties}>
              {String(v)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Text style={{ fontSize: 13, color: '#262626', wordBreak: 'break-word', whiteSpace: 'pre-wrap', textAlign: 'justify', hyphens: 'auto' } as React.CSSProperties}>
      {String(value)}
    </Text>
  );
}

function SourceTags({ field, onSourceClick }: { field: ExtractedField; onSourceClick: (source: ActiveSource) => void }) {
  const refDocs = field.refDocuments ?? [];
  const refRegs = field.refRegulations ?? [];
  const total = refDocs.length + refRegs.length;
  if (total === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {refDocs.map((doc, i) =>
        (doc.bboxes ?? []).map((bbox, j) => (
          <Tag
            key={`doc-${i}-${j}`}
            icon={<FileTextOutlined />}
            color="default"
            style={{ cursor: 'pointer', fontSize: 11 }}
            onClick={() => onSourceClick({ docName: doc.docName, pageIndex: bbox.pageIndex, boxes: bbox.boxes, sourceType: 'document' })}
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
            style={{ cursor: 'pointer', fontSize: 11 }}
            onClick={() => onSourceClick({ docName: reg.docName, pageIndex: bbox.pageIndex, boxes: bbox.boxes, sourceType: 'regulation' })}
          >
            {reg.regulationCode} {reg.sectionNumber}
          </Tag>
        ))
      )}
    </div>
  );
}

const FieldReviewCard: React.FC<FieldReviewCardProps> = ({ field, isActive, onSourceClick }) => {
  const config = STATUS_CONFIG[field.status];
  const isHighPriority = field.status === 'CRITICAL' || field.status === 'WARNING';
  const isOk = field.status === 'OK';

  // OK — flat collapsible row, value hidden until expanded
  if (isOk) {
    const okLabel = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <CheckCircleFilled style={{ color: config.color, fontSize: 13, flexShrink: 0 }} />
        <FieldLabel name={field.fieldName} style={{ fontSize: 13, color: '#595959' }} />
      </div>
    );
    return (
      <div style={{ marginBottom: 4 }}>
        <Collapse
          size="small"
          expandIcon={() => null}
          style={{
            background: '#fff',
            border: '1px solid #f0f0f0',
            borderRadius: 10,
            outline: isActive ? `2px solid ${config.color}` : undefined,
          }}
          items={[{ key: 'ok', label: okLabel, children: <FieldValue value={field.fieldValue} /> }]}
        />
      </div>
    );
  }

  // CRITICAL / WARNING — expanded by default, full detail visible
  if (isHighPriority) {
    return (
      <div
        style={{
          marginBottom: 12,
          borderRadius: 8,
          border: `1px solid ${config.color}40`,
          background: config.bg,
          overflow: 'hidden',
          outline: isActive ? `2px solid ${config.color}` : undefined,
        }}
      >
        {/* Status pill + field name */}
        <div style={{ padding: '10px 14px 8px', borderBottom: `1px solid ${config.color}20` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '1px 8px',
                borderRadius: 4,
                background: config.pillBg,
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.03em',
              }}
            >
              {config.label.toUpperCase()}
            </span>
            <FieldLabel name={field.fieldName} style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 600 }} />
          </div>
          <FieldValue value={field.fieldValue} />
        </div>

        {/* Issue + Suggestion always visible */}
        <div style={{ padding: '10px 14px' }}>
          {field.issue && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <WarningOutlined style={{ color: config.color, marginTop: 2, flexShrink: 0 }} />
              <Text style={{ fontSize: 13, color: '#595959', textAlign: 'justify', hyphens: 'auto' } as React.CSSProperties}>
                {field.issue}
              </Text>
            </div>
          )}
          {field.recommendation && (
            <div style={{ display: 'flex', gap: 6 }}>
              <BulbOutlined style={{ color: '#1890ff', marginTop: 2, flexShrink: 0 }} />
              <Text style={{ fontSize: 13, color: '#595959', textAlign: 'justify', hyphens: 'auto' } as React.CSSProperties}>
                {field.recommendation}
              </Text>
            </div>
          )}
          <SourceTags field={field} onSourceClick={onSourceClick} />
        </div>
      </div>
    );
  }

  // INFO — collapsed by default, expandable
  const collapseLabel = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          display: 'inline-block',
          padding: '1px 8px',
          borderRadius: 4,
          background: '#e6f7ff',
          color: config.color,
          fontSize: 11,
          fontWeight: 600,
          border: `1px solid ${config.color}40`,
        }}
      >
        {config.label.toUpperCase()}
      </span>
      <FieldLabel name={field.fieldName} style={{ fontSize: 13, color: '#262626' }} />
    </div>
  );

  const collapseContent = (
    <div>
      <FieldValue value={field.fieldValue} />
      {field.issue && (
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <WarningOutlined style={{ color: config.color, marginTop: 2, flexShrink: 0 }} />
          <Text style={{ fontSize: 13, color: '#595959', textAlign: 'justify', hyphens: 'auto' } as React.CSSProperties}>
            {field.issue}
          </Text>
        </div>
      )}
      {field.recommendation && (
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <BulbOutlined style={{ color: '#1890ff', marginTop: 2, flexShrink: 0 }} />
          <Text style={{ fontSize: 13, color: '#595959', textAlign: 'justify', hyphens: 'auto' } as React.CSSProperties}>
            {field.recommendation}
          </Text>
        </div>
      )}
      <SourceTags field={field} onSourceClick={onSourceClick} />
    </div>
  );

  return (
    <div style={{ marginBottom: 8 }}>
      <Collapse
        size="small"
        style={{
          borderLeft: `3px solid ${config.color}`,
          borderRadius: 10,
          background: '#fff',
          border: '1px solid #f0f0f0',
          outline: isActive ? `2px solid ${config.color}` : undefined,
        }}
        items={[{ key: 'detail', label: collapseLabel, children: collapseContent }]}
      />
    </div>
  );
};

export default FieldReviewCard;
