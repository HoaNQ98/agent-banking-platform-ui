import type { EmailStatus, EmailCategory, EmailPriority } from '../../api/types';

export const EMAIL_STATUS_CONFIG: Record<EmailStatus, { label: string; color: string; bg: string; textColor: string }> = {
  NEW:           { label: 'New',            color: '#3E7A78', bg: '#E6F0EF', textColor: '#2F5E5C' },
  IN_PROGRESS:   { label: 'In Progress',    color: '#fa8c16', bg: '#fff7e6', textColor: '#ad4e00' },
  AWAITING_SEND: { label: 'Awaiting Send',  color: '#722ed1', bg: '#f9f0ff', textColor: '#531dab' },
  RESOLVED:      { label: 'Resolved',       color: '#52c41a', bg: '#f6ffed', textColor: '#389e0d' },
  CLOSED:        { label: 'Closed',         color: '#8A8578', bg: '#F0ECE3', textColor: '#6B665C' },
  ARCHIVED:      { label: 'Archived',       color: '#B7B0A3', bg: '#F5F3EE', textColor: '#8A8578' },
};

export const EMAIL_PRIORITY_CONFIG: Record<EmailPriority, { label: string; color: string; dotColor: string }> = {
  CRITICAL: { label: 'Critical', color: '#ff4d4f', dotColor: '#ff4d4f' },
  HIGH:     { label: 'High',     color: '#fa8c16', dotColor: '#fa8c16' },
  MEDIUM:   { label: 'Medium',   color: '#3E7A78', dotColor: '#3E7A78' },
  LOW:      { label: 'Low',      color: '#8A8578', dotColor: '#B7B0A3' },
};

export const EMAIL_CATEGORY_LABEL: Record<EmailCategory, string> = {
  LC_OPEN_REQUEST:       'LC Open Request',
  LC_AMENDMENT:          'LC Amendment',
  LC_PAYMENT:            'LC Payment',
  BANK_TRANSFER:         'Bank Transfer',
  ACCOUNT_INQUIRY:       'Account Inquiry',
  LOAN_REQUEST:          'Loan Request',
  TECHNICAL_SUPPORT:     'Technical Support',
  CUSTOMER_SUPPORT:      'Customer Support',
  BILLING_PAYMENT:       'Billing & Payment',
  EDUCATION:             'Education',
  WORK_PROFESSIONAL:     'Work / Professional',
  PERSONAL:              'Personal',
  COMMUNITY_NEWSLETTER:  'Community Newsletter',
  COMMUNITY_FORUM:       'Community Forum',
  MARKETING_PROMOTIONAL: 'Marketing / Promo',
  DOCUMENTATION_REQUEST: 'Documentation',
  COMPLIANCE_REGULATORY: 'Compliance',
  NOTIFICATION_ALERT:    'Notification',
  SPAM_JUNK:             'Spam / Junk',
  UNCATEGORIZED:         'Uncategorized',
};

export const EMAIL_STATUS_OPTIONS = Object.entries(EMAIL_STATUS_CONFIG).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

export const EMAIL_PRIORITY_OPTIONS = Object.entries(EMAIL_PRIORITY_CONFIG).map(([value, cfg]) => ({
  value,
  label: cfg.label,
}));

export const EMAIL_CATEGORY_OPTIONS = Object.entries(EMAIL_CATEGORY_LABEL).map(([value, label]) => ({
  value,
  label,
}));

export const PAGE_SIZE = 20;
