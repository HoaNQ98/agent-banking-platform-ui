import React, { useEffect, useState, useCallback } from 'react';
import { Table, Select, Button, Typography, Tooltip } from 'antd';
import { EyeOutlined, MailOutlined, FilterOutlined, WarningOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { TicketService } from '../../api/services/tickets';
import type { EmailTicket, EmailStatus, EmailCategory, EmailPriority, ListTicketsParams } from '../../api/types';
import {
  StatusBadge,
  PriorityBadge,
  CategoryTag,
  DraftStatusBadge,
} from './EmailBadges';
import TicketDetailModal from './TicketDetailModal';
import {
  EMAIL_STATUS_OPTIONS,
  EMAIL_PRIORITY_OPTIONS,
  EMAIL_CATEGORY_OPTIONS,
  PAGE_SIZE,
} from './emailConstants';

const { Text } = Typography;

interface Filters {
  status: EmailStatus | null;
  priority: EmailPriority | null;
  category: EmailCategory | null;
}

const EMPTY_FILTERS: Filters = { status: null, priority: null, category: null };

const EmailsPage: React.FC = () => {
  const [tickets, setTickets] = useState<EmailTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const hasActiveFilters = filters.status !== null || filters.priority !== null || filters.category !== null;

  const fetchTickets = useCallback(async (currentPage: number, currentFilters: Filters) => {
    setLoading(true);
    setFetchError(null);
    const params: ListTicketsParams = {
      page: currentPage,
      size: PAGE_SIZE,
      ...(currentFilters.status && { status: currentFilters.status }),
      ...(currentFilters.priority && { priority: currentFilters.priority }),
      ...(currentFilters.category && { category: currentFilters.category }),
    };
    try {
      const res = await TicketService.listTickets(params);
      setTickets(res.data);
      setTotal(res.meta.pagination.total);
    } catch (err: any) {
      setFetchError(err.detail || err.message || 'Failed to load tickets.');
      setTickets([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets(page, filters);
  }, [page, filters, fetchTickets]);

  const handleFilterChange = (key: keyof Filters, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value || null }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const columns: ColumnsType<EmailTicket> = [
    {
      title: 'Sender',
      key: 'sender',
      width: 180,
      ellipsis: true,
      render: (_, record) => (
        <div style={{ minWidth: 0 }}>
          <Text
            strong
            style={{ fontSize: '13px', color: '#3A3733', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {record.senderName}
          </Text>
          <Text
            type="secondary"
            style={{ fontSize: '11px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {record.senderEmail}
          </Text>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
      render: (subject: string) => (
        <Tooltip title={subject} placement="topLeft">
          <Text style={{ fontSize: '13px', color: '#3A3733' }}>{subject}</Text>
        </Tooltip>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 160,
      render: (category: EmailCategory) => <CategoryTag category={category} />,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 110,
      render: (priority: EmailPriority) => <PriorityBadge priority={priority} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: EmailStatus) => <StatusBadge status={status} />,
    },
    {
      title: 'Draft Status',
      dataIndex: 'draftStatus',
      key: 'draftStatus',
      width: 120,
      render: (draftStatus: string | null) => <DraftStatusBadge draftStatus={draftStatus} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="View detail">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelectedTicketId(record.id)}
            style={{ color: '#BC6E4E' }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#FAF9F6', overflow: 'hidden' }}>
      {/* Page header */}
      <div
        style={{
          padding: '12px 24px',
          height: '64px',
          background: '#fff',
          borderBottom: '1px solid #EDE9E1',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      >
        <MailOutlined style={{ color: '#8A8578', fontSize: '14px' }} />
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#3A3733' }}>Email Tickets</span>
      </div>

      {/* Filter bar */}
      <div
        style={{
          padding: '12px 24px',
          background: '#fff',
          borderBottom: '1px solid #EDE9E1',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        <FilterOutlined style={{ color: '#8A8578', fontSize: '13px' }} />

        <Select
          allowClear
          placeholder="Status"
          value={filters.status ?? undefined}
          onChange={(v) => handleFilterChange('status', v ?? null)}
          options={EMAIL_STATUS_OPTIONS}
          style={{ width: 148, borderRadius: '8px' }}
          size="middle"
        />

        <Select
          allowClear
          placeholder="Priority"
          value={filters.priority ?? undefined}
          onChange={(v) => handleFilterChange('priority', v ?? null)}
          options={EMAIL_PRIORITY_OPTIONS}
          style={{ width: 130, borderRadius: '8px' }}
          size="middle"
        />

        <Select
          allowClear
          placeholder="Category"
          value={filters.category ?? undefined}
          onChange={(v) => handleFilterChange('category', v ?? null)}
          options={EMAIL_CATEGORY_OPTIONS}
          showSearch
          optionFilterProp="label"
          style={{ width: 190, borderRadius: '8px' }}
          size="middle"
        />

        {hasActiveFilters && (
          <Button
            type="link"
            size="small"
            onClick={handleClearFilters}
            style={{ color: '#8A8578', padding: '0 4px', fontSize: '13px' }}
          >
            Clear filters
          </Button>
        )}

        <div style={{ marginLeft: 'auto' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {total} ticket{total !== 1 ? 's' : ''}
          </Text>
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
        <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #EDE9E1' }}>
        <Table<EmailTicket>
          rowKey="id"
          dataSource={tickets}
          columns={columns}
          loading={loading}
          scroll={{ x: 900 }}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            showSizeChanger: false,
            showTotal: (t, range) => (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {range[0]}–{range[1]} of {t}
              </Text>
            ),
            onChange: (p) => setPage(p),
          }}
          style={{ background: '#fff' }}
          rowClassName={() => 'email-ticket-row'}
          onRow={(record) => ({
            style: { cursor: 'default' },
            onMouseEnter: (e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '#F5F3EE';
            },
            onMouseLeave: (e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = '';
            },
          })}
          locale={{
            emptyText: fetchError ? (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <WarningOutlined style={{ fontSize: '36px', color: '#ff4d4f', marginBottom: '12px', display: 'block' }} />
                <Text style={{ color: '#ff4d4f', fontSize: '13px' }}>{fetchError}</Text>
                <div style={{ marginTop: '10px' }}>
                  <Button size="small" onClick={() => fetchTickets(page, filters)}>Retry</Button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '48px 0', textAlign: 'center' }}>
                <MailOutlined style={{ fontSize: '36px', color: '#B7B0A3', marginBottom: '12px', display: 'block' }} />
                <Text type="secondary">No tickets found</Text>
                {hasActiveFilters && (
                  <div style={{ marginTop: '8px' }}>
                    <Button type="link" size="small" onClick={handleClearFilters}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            ),
          }}
        />
        </div>
      </div>

      <TicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
      />
    </div>
  );
};

export default EmailsPage;
