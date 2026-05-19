// Layout Constants
export const LAYOUT = {
  SIDEBAR_WIDTH: 280,
  FORM_BUILDER_WIDTH: 400,
  REVIEW_PANEL_WIDTH_PERCENT: 67,
  CHAT_COMPRESSED_WIDTH_PERCENT: 33,
  HEADER_HEIGHT: 64,
  INPUT_AREA_HEIGHT: 80,
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1280,
  },
} as const;

// Animation Durations (in ms)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Default Messages
export const DEFAULT_MESSAGES = {
  WELCOME: "Hi! I'm your Banking Assistant. How can I help you today?",
  ERROR: "Sorry, something went wrong. Please try again.",
  LOADING: "Thinking...",
} as const;

// Sample Conversation Starters
export const CONVERSATION_STARTERS = [
  'Apply for a loan',
  'Check account balance',
  'Make a transfer',
  'Report a lost card',
] as const;

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.png', '.jpg', '.jpeg', '.xlsx'],
} as const;

// Form Field Defaults
export const FORM_DEFAULTS = {
  CURRENCY_SYMBOL: '$',
  CURRENCY_CODE: 'USD',
  DATE_FORMAT: 'MM/dd/yyyy',
} as const;

// Regulation Documents
export const REGULATION_DOCUMENTS = {
  INCOTERMS_2020: {
    label: 'Incoterms 2020',
    path: '/docs/regulations/Incoterms2020.pdf',
  },
  UCP_600: {
    label: 'UCP 600',
    path: '/docs/regulations/UCP600_English.pdf',
  },
  ISBP_821: {
    label: 'ISBP 821',
    path: '/docs/regulations/ISBP_821.pdf',
  },
} as const;

export function getRegulationPath(docName: string): string | null {
  const normalized = docName.trim().toLowerCase();
  const entry = Object.values(REGULATION_DOCUMENTS).find(
    (doc) =>
      doc.path.toLowerCase().endsWith(normalized) ||
      doc.label.toLowerCase() === normalized
  );
  return entry?.path ?? null;
}

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PHONE: /^\+?[\d\s\-()]+$/,
  CURRENCY: /^\d+(\.\d{1,2})?$/,
} as const;
