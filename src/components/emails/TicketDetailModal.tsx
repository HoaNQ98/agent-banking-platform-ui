import React, { useEffect, useState } from 'react';
import { Modal, Spin, Typography, Divider, Collapse, Tag, Button, Select } from 'antd';
import {
  MailOutlined,
  CalendarOutlined,
  TagOutlined,
  PaperClipOutlined,
  RobotOutlined,
  SendOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { TicketService } from '../../api/services/tickets';
import type { EmailTicket, EmailStatus } from '../../api/types';
import { PriorityBadge, CategoryTag } from './EmailBadges';
import { EMAIL_STATUS_CONFIG, EMAIL_STATUS_OPTIONS } from './emailConstants';

const { Text } = Typography;

interface TicketDetailModalProps {
  ticketId: string | null;
  onClose: () => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

function senderInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// ─── Shared MetaRow ──────────────────────────────────────────────────────────

const MetaRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid #f5f5f5' }}>
    <Text type="secondary" style={{ fontSize: '11px', fontWeight: 600, minWidth: '90px', flexShrink: 0, paddingTop: '2px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
      {label}
    </Text>
    <div style={{ fontSize: '13px', color: '#262626', flex: 1 }}>{children}</div>
  </div>
);

// ─── Section label ────────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#8c8c8c', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
    {icon}{children}
  </div>
);

// ─── Gmail label chips ────────────────────────────────────────────────────────

const GMAIL_LABEL_COLOR: Record<string, string> = {
  UNREAD: 'blue',
  INBOX: 'default',
  SPAM: 'red',
  STARRED: 'gold',
};

function gmailLabelColor(label: string): string {
  if (GMAIL_LABEL_COLOR[label]) return GMAIL_LABEL_COLOR[label];
  if (label.startsWith('CATEGORY_')) return 'default';
  return 'default';
}

function gmailLabelText(label: string): string {
  if (label.startsWith('CATEGORY_')) return label.replace('CATEGORY_', '').replace(/_/g, ' ');
  return label;
}

// ─── AI Draft card ────────────────────────────────────────────────────────────

const DraftCard: React.FC<{ ticket: EmailTicket }> = ({ ticket }) => {
  const hasDraft = !!ticket.draft;
  const draftStatus = ticket.draftStatus ?? ticket.draft?.status;
  // The backend may return HTML in bodyText with bodyHtml null
  const draftContent = ticket.draft?.bodyHtml || ticket.draft?.bodyText || '';
  const draftIsHtml = /^\s*</.test(draftContent);

  return (
    <div
      style={{
        borderRadius: '10px',
        border: hasDraft ? '1px solid #d3adf7' : '1px solid #f0f0f0',
        background: hasDraft ? '#f9f0ff' : '#fafafa',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RobotOutlined style={{ color: hasDraft ? '#722ed1' : '#bfbfbf', fontSize: '15px' }} />
          <Text strong style={{ fontSize: '13px', color: hasDraft ? '#531dab' : '#8c8c8c' }}>
            AI Draft Reply
          </Text>
        </div>
        {draftStatus && (
          <span style={{ fontSize: '11px', color: '#722ed1', background: '#efdbff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
            {draftStatus}
          </span>
        )}
      </div>

      {hasDraft ? (
        <>
          {/* Draft subject */}
          <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '6px' }}>
            Re: {ticket.draft!.subject}
          </Text>
          {/* Draft body preview */}
          {draftIsHtml ? (
            <div
              style={{
                background: '#fff',
                border: '1px solid #efdbff',
                borderRadius: '8px',
                maxHeight: '320px',
                overflowY: 'auto',
                marginBottom: '14px',
              }}
            >
              <iframe
                srcDoc={draftContent}
                sandbox="allow-same-origin"
                style={{ width: '100%', minHeight: '200px', border: 'none', display: 'block' }}
                title="Draft reply body"
                onLoad={(e) => {
                  const iframe = e.currentTarget;
                  const height = iframe.contentDocument?.body?.scrollHeight;
                  if (height) iframe.style.height = `${height}px`;
                }}
              />
            </div>
          ) : (
            <div
              style={{
                fontSize: '13px',
                color: '#262626',
                lineHeight: 1.6,
                background: '#fff',
                border: '1px solid #efdbff',
                borderRadius: '8px',
                padding: '12px',
                maxHeight: '160px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                marginBottom: '14px',
              }}
            >
              {draftContent || '—'}
            </div>
          )}
          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Button size="small" icon={<EditOutlined />} style={{ borderRadius: '7px' }}>
              Edit Draft
            </Button>
            <Button
              type="primary"
              size="small"
              icon={<SendOutlined />}
              style={{
                borderRadius: '7px',
                background: 'linear-gradient(135deg, #0047AB 0%, #1890ff 100%)',
                border: 'none',
                boxShadow: '0 2px 6px rgba(0,71,171,0.25)',
              }}
            >
              Send
            </Button>
          </div>
        </>
      ) : (
        <Text type="secondary" style={{ fontSize: '13px' }}>
          No draft reply generated yet.
        </Text>
      )}
    </div>
  );
};

// ─── Original email card ──────────────────────────────────────────────────────

const OriginalEmailCard: React.FC<{ ticket: EmailTicket }> = ({ ticket }) => {
  const initials = senderInitials(ticket.senderName);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const resizeIframe = () => {
    const iframe = iframeRef.current;
    const height = iframe?.contentDocument?.body?.scrollHeight;
    if (iframe && height) {
      iframe.style.height = `${height}px`;
    }
  };

  const collapseLabel = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1890ff 0%, #13c2c2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '11px',
          fontWeight: 700,
          color: '#fff',
        }}
      >
        {initials}
      </div>
      <div style={{ minWidth: 0 }}>
        <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block' }}>{ticket.senderName}</Text>
        <Text type="secondary" style={{ fontSize: '11px' }}>{ticket.senderEmail} · {formatDateTime(ticket.receivedAt)}</Text>
      </div>
    </div>
  );

  const hasHtml = !!ticket.bodyHtml?.trim();
  const hasText = !!ticket.bodyText?.trim();

  return (
    <Collapse
      defaultActiveKey={[]}
      onChange={resizeIframe}
      style={{ borderRadius: '10px', border: '1px solid #f0f0f0', background: '#fff', marginBottom: '12px' }}
      items={[{
        key: 'email',
        label: collapseLabel,
        children: (
          <div>
            {hasHtml ? (
              <iframe
                ref={iframeRef}
                srcDoc={ticket.bodyHtml}
                sandbox="allow-same-origin"
                style={{ width: '100%', minHeight: '320px', border: 'none', borderRadius: '6px', background: '#fff' }}
                title="Email body"
                onLoad={resizeIframe}
              />
            ) : hasText ? (
              <pre style={{ fontSize: '13px', color: '#262626', whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, lineHeight: 1.6 }}>
                {ticket.bodyText}
              </pre>
            ) : (
              <Text type="secondary" style={{ fontSize: '13px' }}>No email body available.</Text>
            )}
          </div>
        ),
      }]}
    />
  );
};

// ─── Attachments card ─────────────────────────────────────────────────────────

const AttachmentsCard: React.FC<{ ticket: EmailTicket }> = ({ ticket }) => {
  const attachments = ticket.attachments ?? [];

  return (
    <div style={{ borderRadius: '10px', border: '1px solid #f0f0f0', background: '#fff', padding: '12px 16px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: attachments.length ? '10px' : 0 }}>
        <PaperClipOutlined style={{ color: '#8c8c8c', fontSize: '13px' }} />
        <Text style={{ fontSize: '13px', color: '#595959', fontWeight: 500 }}>
          Attachments ({attachments.length})
        </Text>
      </div>
      {attachments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {attachments.map((a) => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: '#fafafa', borderRadius: '6px', border: '1px solid #f0f0f0' }}>
              <PaperClipOutlined style={{ color: '#8c8c8c', fontSize: '12px' }} />
              <Text style={{ fontSize: '12px', flex: 1 }}>{a.filename}</Text>
              <Text type="secondary" style={{ fontSize: '11px' }}>{(a.fileSize / 1024).toFixed(1)} KB</Text>
            </div>
          ))}
        </div>
      ) : (
        <Text type="secondary" style={{ fontSize: '12px' }}>No attachments</Text>
      )}
    </div>
  );
};

// ─── Right panel — ticket info ────────────────────────────────────────────────

const TicketInfoPanel: React.FC<{ ticket: EmailTicket }> = ({ ticket }) => {
  const [status, setStatus] = useState<EmailStatus>(ticket.status);

  const statusCfg = EMAIL_STATUS_CONFIG[status];

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px' }}>
      {/* Status — editable */}
      <SectionLabel icon={<TagOutlined style={{ fontSize: '10px' }} />}>Status</SectionLabel>
      <Select
        value={status}
        onChange={(v) => setStatus(v)}
        style={{ width: '100%', marginBottom: '16px' }}
        options={EMAIL_STATUS_OPTIONS}
        optionRender={(opt) => {
          const cfg = EMAIL_STATUS_CONFIG[opt.value as EmailStatus];
          return (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg?.color, flexShrink: 0, display: 'inline-block' }} />
              {opt.label}
            </span>
          );
        }}
        labelRender={() => (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusCfg.color, flexShrink: 0, display: 'inline-block' }} />
            <span style={{ color: statusCfg.textColor, fontWeight: 600, fontSize: '13px' }}>{statusCfg.label}</span>
          </span>
        )}
      />

      <Divider style={{ margin: '0 0 16px' }} />

      {/* Classification */}
      <SectionLabel>Classification</SectionLabel>
      <MetaRow label="Priority"><PriorityBadge priority={ticket.priority} /></MetaRow>
      <MetaRow label="Category"><CategoryTag category={ticket.category} /></MetaRow>

      <Divider style={{ margin: '16px 0' }} />

      {/* Sender */}
      <SectionLabel icon={<MailOutlined style={{ fontSize: '10px' }} />}>Sender</SectionLabel>
      <MetaRow label="Name">{ticket.senderName || '—'}</MetaRow>
      <MetaRow label="Email">
        <a href={`mailto:${ticket.senderEmail}`} style={{ color: '#1677ff', fontSize: '12px', wordBreak: 'break-all' }}>
          {ticket.senderEmail}
        </a>
      </MetaRow>

      <Divider style={{ margin: '16px 0' }} />

      {/* Timestamps */}
      <SectionLabel icon={<CalendarOutlined style={{ fontSize: '10px' }} />}>Timestamps</SectionLabel>
      <MetaRow label="Received">{formatDateTime(ticket.receivedAt)}</MetaRow>
      <MetaRow label="Created">{formatDateTime(ticket.createdAt)}</MetaRow>
      {ticket.updatedAt && (
        <MetaRow label="Updated">{formatDateTime(ticket.updatedAt)}</MetaRow>
      )}
      <MetaRow label="Thread">
        <Text type="secondary" style={{ fontSize: '11px', fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {ticket.threadId}
        </Text>
      </MetaRow>

      {/* Gmail labels */}
      {ticket.gmailLabelIds && ticket.gmailLabelIds.length > 0 && (
        <>
          <Divider style={{ margin: '16px 0' }} />
          <SectionLabel>Gmail Labels</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {ticket.gmailLabelIds.map((label) => (
              <Tag key={label} color={gmailLabelColor(label)} style={{ fontSize: '11px', borderRadius: '4px', margin: 0 }}>
                {gmailLabelText(label)}
              </Tag>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Main modal ───────────────────────────────────────────────────────────────

const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticketId, onClose }) => {
  const [ticket, setTicket] = useState<EmailTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) { setTicket(null); return; }
    setLoading(true);
    setError(null);
    TicketService.getTicket(ticketId)
      .then((res) => setTicket(res.data))
      .catch((err) => setError(err.detail || err.message || 'Failed to load ticket'))
      .finally(() => setLoading(false));
  }, [ticketId]);

  return (
    <Modal
      open={!!ticketId}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ maxWidth: '1200px', top: '32px' }}
      styles={{
        body: { padding: 0 },
      }}
      closable={false}
    >
      {/* Modal header */}
      <div
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <MailOutlined style={{ color: '#8c8c8c', fontSize: '14px', flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <Text strong style={{ fontSize: '14px', color: '#262626', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {ticket?.subject ?? '—'}
            </Text>
            {ticket && (
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {ticket.senderName} · {formatDateTime(ticket.receivedAt)}
              </Text>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            flexShrink: 0,
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#f5f5f5',
            border: '1px solid #e8e8e8',
            color: '#595959',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#ebebeb')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '12px' }}>
          <Text style={{ color: '#ff4d4f', fontSize: '13px' }}>{error}</Text>
          <Button size="small" onClick={() => ticketId && TicketService.getTicket(ticketId).then((r) => setTicket(r.data))}>
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && ticket && (
        <div style={{ display: 'flex', height: '78vh' }}>
          {/* Left — email thread (2/3) */}
          <div style={{ flex: '0 0 67%', overflowY: 'auto', padding: '20px', borderRight: '1px solid #f0f0f0', background: '#fafafa' }}>
            <DraftCard ticket={ticket} />
            <OriginalEmailCard ticket={ticket} />
            <AttachmentsCard ticket={ticket} />
          </div>

          {/* Right — ticket info (1/3) */}
          <div style={{ flex: '0 0 33%', background: '#fff', overflow: 'hidden' }}>
            <TicketInfoPanel ticket={ticket} />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TicketDetailModal;
