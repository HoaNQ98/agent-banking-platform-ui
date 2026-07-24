import React from 'react';
import { Tag, Tooltip } from 'antd';
import type { EmailStatus, EmailCategory, EmailPriority } from '../../api/types';
import {
  EMAIL_STATUS_CONFIG,
  EMAIL_PRIORITY_CONFIG,
  EMAIL_CATEGORY_LABEL,
} from './emailConstants';

export const StatusBadge: React.FC<{ status: EmailStatus }> = ({ status }) => {
  const cfg = EMAIL_STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: '4px',
        background: cfg.bg,
        color: cfg.textColor,
        fontSize: '12px',
        fontWeight: 600,
        border: `1px solid ${cfg.color}40`,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: EmailPriority }> = ({ priority }) => {
  const cfg = EMAIL_PRIORITY_CONFIG[priority];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: cfg.dotColor,
          flexShrink: 0,
          display: 'inline-block',
        }}
      />
      <span style={{ fontSize: '13px', color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>
    </span>
  );
};

export const CategoryTag: React.FC<{ category: EmailCategory }> = ({ category }) => (
  <Tag style={{ fontSize: '12px', borderRadius: '4px', margin: 0 }}>
    {EMAIL_CATEGORY_LABEL[category]}
  </Tag>
);

export const DraftStatusBadge: React.FC<{ draftStatus: string | null }> = ({ draftStatus }) => {
  if (!draftStatus) return <span style={{ color: '#B7B0A3', fontSize: '12px' }}>—</span>;
  return (
    <span style={{ fontSize: '12px', color: '#722ed1', fontStyle: 'italic' }}>{draftStatus}</span>
  );
};

const MAX_VISIBLE_TAGS = 2;

export const TagsList: React.FC<{ tags: string[] | null }> = ({ tags }) => {
  if (!tags || tags.length === 0) return <span style={{ color: '#B7B0A3', fontSize: '12px' }}>—</span>;

  const visible = tags.slice(0, MAX_VISIBLE_TAGS);
  const overflow = tags.length - MAX_VISIBLE_TAGS;

  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
      {visible.map((t) => (
        <Tag key={t} style={{ fontSize: '11px', margin: 0, borderRadius: '4px' }}>{t}</Tag>
      ))}
      {overflow > 0 && (
        <Tooltip title={tags.slice(MAX_VISIBLE_TAGS).join(', ')}>
          <Tag style={{ fontSize: '11px', margin: 0, borderRadius: '4px', cursor: 'default' }}>
            +{overflow}
          </Tag>
        </Tooltip>
      )}
    </span>
  );
};
