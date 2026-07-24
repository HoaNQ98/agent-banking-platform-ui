import React, { useEffect, useState } from 'react';
import { Drawer, Spin, Typography, Divider, Alert } from 'antd';
import { MailOutlined, CalendarOutlined, TagOutlined, UserOutlined } from '@ant-design/icons';
import { TicketService } from '../../api/services/tickets';
import type { EmailTicket } from '../../api/types';
import {
  StatusBadge,
  PriorityBadge,
  CategoryTag,
  DraftStatusBadge,
  TagsList,
} from './EmailBadges';

const { Text, Title } = Typography;

interface TicketDetailDrawerProps {
  ticketId: string | null;
  onClose: () => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

const MetaRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #F0ECE3' }}>
    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, minWidth: '110px', flexShrink: 0, paddingTop: '1px' }}>
      {label}
    </Text>
    <div style={{ fontSize: '13px', color: '#3A3733', flex: 1 }}>{children}</div>
  </div>
);

const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({ ticketId, onClose }) => {
  const [ticket, setTicket] = useState<EmailTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) {
      setTicket(null);
      return;
    }
    setLoading(true);
    setError(null);
    TicketService.getTicket(ticketId)
      .then((res) => setTicket(res.data))
      .catch((err) => setError(err.detail || err.message || 'Failed to load ticket'))
      .finally(() => setLoading(false));
  }, [ticketId]);

  return (
    <Drawer
      open={!!ticketId}
      onClose={onClose}
      size="large"
      closable={false}
      styles={{
        header: { display: 'none' },
        body: { padding: 0 },
      }}
    >
      {/* Gradient header — matches LoginModal / brand pattern */}
      <div
        style={{
          background: 'linear-gradient(135deg, #A85E3E 0%, #C67A54 55%, #C9A05E 100%)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            background: 'rgba(255,255,255,0.2)',
            border: '1.5px solid rgba(255,255,255,0.45)',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <MailOutlined style={{ color: '#fff', fontSize: '16px' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>
            Ticket Detail
          </div>
          <div
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: '15px',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {ticket?.subject ?? '—'}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            flexShrink: 0,
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.35)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.35)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px', overflowY: 'auto', height: 'calc(100% - 100px)' }}>
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
            <Spin size="large" />
          </div>
        )}

        {error && (
          <Alert type="error" message={error} showIcon style={{ borderRadius: '8px' }} />
        )}

        {!loading && !error && ticket && (
          <>
            {/* Sender section */}
            <div style={{ marginBottom: '4px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: '#8A8578',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <UserOutlined style={{ fontSize: '10px' }} /> Sender
              </div>
              <MetaRow label="Name">{ticket.senderName || '—'}</MetaRow>
              <MetaRow label="Email">
                <a href={`mailto:${ticket.senderEmail}`} style={{ color: '#BC6E4E' }}>
                  {ticket.senderEmail}
                </a>
              </MetaRow>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Classification section */}
            <div style={{ marginBottom: '4px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: '#8A8578',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <TagOutlined style={{ fontSize: '10px' }} /> Classification
              </div>
              <MetaRow label="Status"><StatusBadge status={ticket.status} /></MetaRow>
              <MetaRow label="Priority"><PriorityBadge priority={ticket.priority} /></MetaRow>
              <MetaRow label="Category"><CategoryTag category={ticket.category} /></MetaRow>
              <MetaRow label="Tags"><TagsList tags={ticket.tags} /></MetaRow>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* AI Draft section */}
            <div style={{ marginBottom: '4px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: '#8A8578',
                  marginBottom: '10px',
                }}
              >
                AI Draft Reply
              </div>
              <MetaRow label="Draft Status">
                <DraftStatusBadge draftStatus={ticket.draftStatus} />
              </MetaRow>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Timestamps section */}
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: '#8A8578',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CalendarOutlined style={{ fontSize: '10px' }} /> Timestamps
              </div>
              <MetaRow label="Received At">{formatDateTime(ticket.receivedAt)}</MetaRow>
              <MetaRow label="Created At">{formatDateTime(ticket.createdAt)}</MetaRow>
              <MetaRow label="Thread ID">
                <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                  {ticket.threadId}
                </Text>
              </MetaRow>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default TicketDetailDrawer;
