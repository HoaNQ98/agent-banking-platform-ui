# Banking Agent Assistant - UI Design Specifications

## Overview
A three-section intelligent banking assistant interface inspired by Gemini and Claude, featuring dynamic form generation capabilities.

---

## Color Palette - Banking Theme

### Primary Colors
- **Primary Blue**: `#0047AB` (Trust, Security) - Main brand color
- **Primary Dark**: `#002D6B` - Headers, important elements
- **Primary Light**: `#E6F0FF` - Backgrounds, hover states

### Secondary Colors
- **Secondary Green**: `#00A86B` (Success, Approval) - Positive actions, success states
- **Secondary Gold**: `#D4AF37` (Premium, Value) - Accent, highlights
- **Teal**: `#008B8B` - Interactive elements, links

### Neutral Colors
- **Gray 50**: `#F9FAFB` - Page background
- **Gray 100**: `#F3F4F6` - Card backgrounds
- **Gray 200**: `#E5E7EB` - Borders, dividers
- **Gray 400**: `#9CA3AF` - Placeholder text
- **Gray 600**: `#4B5563` - Secondary text
- **Gray 900**: `#111827` - Primary text

### Semantic Colors
- **Error Red**: `#DC2626` - Errors, warnings
- **Warning Orange**: `#F59E0B` - Alerts
- **Info Blue**: `#3B82F6` - Information
- **Success Green**: `#10B981` - Success messages

---

## Layout Structure

### Overall Grid System
```
┌─────────────────────────────────────────────────────────────┐
│  [Sidebar Toggle] Banking Agent Assistant     [Form Toggle] │ Header (64px)
├──────────┬─────────────────────────────────┬─────────────────┤
│          │                                 │                 │
│ Sidebar  │     Main Chat Section           │  Form Builder   │
│ (280px)  │     (Flexible)                  │  (400px)        │
│          │                                 │  (Hidden by     │
│ Convos   │     Messages                    │   default)      │
│ List     │     User Input                  │                 │
│          │     File Upload                 │  Generated Form │
│          │                                 │  Preview        │
│          │                                 │                 │
└──────────┴─────────────────────────────────┴─────────────────┘
```

### Responsive Breakpoints
- **Desktop**: ≥1280px - All three sections visible when toggled
- **Tablet**: 768px-1279px - Sidebar overlays, form builder slides over
- **Mobile**: <768px - Full-screen sections with smooth transitions

---

## Section 1: Sidebar (Conversation Management)

### Dimensions
- **Width**: 280px (desktop), full-screen overlay (mobile)
- **Background**: `#FFFFFF` with subtle shadow
- **Border**: Right border `1px solid #E5E7EB`

### Components

#### 1. Sidebar Header
```
┌────────────────────────────┐
│  [≡] Conversations  [+]    │  Height: 64px
└────────────────────────────┘
```
- Toggle button (left): 24×24px hamburger icon
- Title: "Conversations" - Font: 16px, Semi-bold, Gray 900
- New chat button (right): 32×32px "+" icon button, Primary Blue

#### 2. Conversation List
```
┌────────────────────────────┐
│ ○ New Loan Application     │  Each: 72px height
│   2 minutes ago            │
├────────────────────────────┤
│ ○ Account Balance Query    │
│   1 hour ago               │
├────────────────────────────┤
│ ○ Transfer Request         │
│   Yesterday                │
└────────────────────────────┘
```

**Each Conversation Card**:
- Padding: 16px
- Border-radius: 8px
- Background: Transparent (hover: Gray 100, active: Primary Light)
- Title: 14px, Medium weight, Gray 900, truncate after 2 lines
- Timestamp: 12px, Regular, Gray 400
- Indicator dot: 8px circle (active conversation: Primary Blue)
- Right-aligned actions: Edit (pencil), Delete (trash) - appear on hover

#### 3. Sidebar Footer
```
┌────────────────────────────┐
│  [👤] User Profile          │  Height: 64px
│  [⚙] Settings              │
└────────────────────────────┘
```

### Interactions
- **Toggle**: Slide in/out animation (300ms ease-in-out)
- **Hover state**: Background Gray 100
- **Active state**: Background Primary Light, left border 3px Primary Blue
- **Scroll**: Smooth scrolling with custom scrollbar (8px width, Primary Blue thumb)

---

## Section 2: Main Chat Section

### Layout
```
┌─────────────────────────────────────┐
│          Chat Header                │  64px
├─────────────────────────────────────┤
│                                     │
│        Messages Area                │  Flexible
│        (Scrollable)                 │
│                                     │
├─────────────────────────────────────┤
│     File Upload Preview             │  Auto (if files)
├─────────────────────────────────────┤
│     Input + Send Button             │  80px
└─────────────────────────────────────┘
```

### Chat Header
- **Background**: White with bottom border `1px solid #E5E7EB`
- **Content**:
  - Agent avatar (40×40px rounded circle, gradient Primary Blue to Teal)
  - Agent name: "Banking Assistant" - 16px, Semi-bold
  - Status indicator: "Online" - 12px, Success Green dot

### Messages Area

#### User Message Bubble
```
                                  ┌─────────────────────────┐
                                  │ I need to apply for a   │
                                  │ business loan           │
                                  │                         │
                                  │ [📄 document.pdf]       │
                                  └─────────────────────────┘
                                         You · 2:34 PM  [👤]
```
- **Alignment**: Right
- **Background**: `#0047AB` (Primary Blue)
- **Text color**: White
- **Padding**: 12px 16px
- **Border-radius**: 18px (top-left, top-right, bottom-left), 4px (bottom-right)
- **Max-width**: 70%
- **Font**: 14px, Regular
- **Margin**: 8px 0

#### Agent Message Bubble
```
[🤖] Agent · 2:34 PM
┌─────────────────────────────────────────┐
│ I'll help you with your business loan   │
│ application. To get started, I need to  │
│ extract some information from your      │
│ document.                               │
│                                         │
│ [✓ Processing document...]             │
└─────────────────────────────────────────┘
```
- **Alignment**: Left
- **Background**: `#F3F4F6` (Gray 100)
- **Text color**: Gray 900
- **Padding**: 12px 16px
- **Border-radius**: 4px (top-left), 18px (top-right, bottom-left, bottom-right)
- **Max-width**: 80%
- **Font**: 14px, Regular
- **Left border**: 3px solid Primary Blue (for emphasis)

#### Special Message Types

**Loading State**:
```
[🤖] Agent
┌─────────────────────────────┐
│ ● ● ●  Thinking...         │
└─────────────────────────────┘
```
- Animated dots (pulse animation)
- Background: Gray 100

**Form Request Trigger**:
```
[🤖] Agent
┌─────────────────────────────────────────┐
│ I've extracted the following fields:    │
│                                         │
│ [📋 View Form Builder →]               │
└─────────────────────────────────────────┘
```
- Call-to-action button with icon
- Background: Primary Light
- Border: 2px solid Primary Blue
- Opens form builder section when clicked

### File Upload Preview Area
```
┌────────────────────────────────────────┐
│ [📄 document.pdf]  [❌]                 │
│ [📊 statement.xlsx] [❌]                │
└────────────────────────────────────────┘
```
- **Background**: Gray 50
- **Height**: Auto (appears only when files are selected)
- **Padding**: 12px 16px
- **File chip**:
  - Background: White
  - Border: 1px solid Gray 200
  - Padding: 8px 12px
  - Border-radius: 20px
  - Icon (left): File type icon 20×20px
  - Close button (right): 16×16px × icon

### Input Area
```
┌─────────────────────────────────────────────────────────┐
│ [📎]  Type your message...                      [Send] │
└─────────────────────────────────────────────────────────┘
```
- **Background**: White
- **Border**: 2px solid Gray 200 (focus: Primary Blue)
- **Border-radius**: 24px
- **Padding**: 16px 20px
- **Height**: 56px (auto-expand up to 120px for multiline)

**Attachment Button**:
- Position: Left, 32×32px
- Icon: Paperclip, Gray 400 (hover: Primary Blue)
- Opens file picker (multiple files allowed)

**Input Field**:
- Font: 14px, Regular, Gray 900
- Placeholder: Gray 400
- Auto-resize vertically

**Send Button**:
- Position: Right, 40×40px
- Background: Primary Blue (disabled: Gray 300)
- Icon: Paper plane, White
- Border-radius: 50%
- Hover: Primary Dark

---

## Section 3: Form Builder (Dynamic)

### Dimensions
- **Width**: 400px (desktop), full-screen (mobile)
- **Background**: White
- **Border**: Left border `1px solid #E5E7EB`
- **Default State**: Hidden (slides in from right)

### Layout
```
┌────────────────────────────┐
│  [←] Form Builder   [✓]    │  Header: 64px
├────────────────────────────┤
│                            │
│    Generated Form          │
│    (Scrollable)            │
│                            │
│  Field 1: [Input]          │
│  Field 2: [Input]          │
│  Field 3: [Dropdown]       │
│  Field 4: [Date]           │
│                            │
├────────────────────────────┤
│  [Cancel]  [Submit Form]   │  Footer: 80px
└────────────────────────────┘
```

### Form Builder Header
- **Background**: Primary Light
- **Border-bottom**: 2px solid Primary Blue
- **Padding**: 16px 20px
- Close button (left): "←" back arrow, Primary Blue
- Title: "Form Builder" - 16px, Semi-bold, Gray 900
- Save/Confirm button (right): Checkmark icon, Success Green

### Form Fields Area

#### Field Container
```
┌────────────────────────────────────┐
│ Business Name *                    │
│ ┌────────────────────────────────┐ │
│ │ ABC Corporation                │ │
│ └────────────────────────────────┘ │
│ ✓ Extracted from document         │
└────────────────────────────────────┘
```

**Each Field**:
- **Margin**: 16px bottom
- **Label**:
  - Font: 14px, Medium, Gray 900
  - Required indicator (*): Error Red
- **Input**:
  - Background: White
  - Border: 1px solid Gray 200
  - Border-radius: 8px
  - Padding: 12px 16px
  - Font: 14px, Regular
  - Focus: Border 2px Primary Blue, box-shadow
- **Helper Text**:
  - Font: 12px, Regular, Gray 400
  - Icon: Info circle or checkmark (if extracted)
  - Color: Success Green if auto-filled

#### Field Types

**Text Input**:
```
┌────────────────────────────────────┐
│ [Text input area]                  │
└────────────────────────────────────┘
```

**Dropdown/Select**:
```
┌────────────────────────────────────┐
│ Select an option          [▼]      │
└────────────────────────────────────┘
```

**Date Picker**:
```
┌────────────────────────────────────┐
│ MM/DD/YYYY                [📅]     │
└────────────────────────────────────┘
```

**Currency Input**:
```
┌────────────────────────────────────┐
│ $ [Amount]                    USD  │
└────────────────────────────────────┘
```
- Symbol (left): Gray 600
- Currency code (right): Gray 400

**File Upload (within form)**:
```
┌────────────────────────────────────┐
│ [📤 Upload Document]               │
│                                    │
│ or drag and drop                   │
│ PDF, PNG, JPG (max 10MB)          │
└────────────────────────────────────┘
```
- Border: 2px dashed Gray 300
- Background: Gray 50
- Hover: Border Primary Blue, Background Primary Light

#### Validation States

**Error State**:
```
┌────────────────────────────────────┐
│ [Invalid input]                    │
└────────────────────────────────────┘
❌ This field is required
```
- Border: Error Red
- Helper text: Error Red with error icon

**Success State**:
```
┌────────────────────────────────────┐
│ [Valid input]                  [✓] │
└────────────────────────────────────┘
```
- Checkmark icon (right): Success Green

### Form Builder Footer
- **Background**: White
- **Border-top**: 1px solid Gray 200
- **Padding**: 16px 20px
- **Buttons**:
  - Cancel: Ghost button, Gray text
  - Submit: Primary button, Primary Blue background, White text
  - Full width on mobile, side-by-side on desktop

---

## Typography

### Font Family
- **Primary**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Monospace** (for codes/numbers): `"SF Mono", Monaco, monospace`

### Font Scales
- **Hero/H1**: 32px / Bold / 1.2 line-height
- **H2**: 24px / Semi-bold / 1.3 line-height
- **H3**: 20px / Semi-bold / 1.4 line-height
- **H4**: 18px / Semi-bold / 1.4 line-height
- **Body Large**: 16px / Regular / 1.5 line-height
- **Body**: 14px / Regular / 1.5 line-height
- **Small**: 12px / Regular / 1.4 line-height
- **Tiny**: 10px / Medium / 1.3 line-height

---

## Iconography

### Icon Library
- **Recommended**: Heroicons, Lucide, or Phosphor Icons
- **Size**: 16px (small), 20px (medium), 24px (large), 32px (xlarge)
- **Style**: Outline for most, Solid for emphasis

### Key Icons
- **Sidebar Toggle**: ≡ (hamburger menu)
- **New Chat**: + (plus)
- **Send Message**: ➤ (paper plane)
- **Attach File**: 📎 (paperclip)
- **Form Builder**: 📋 (clipboard)
- **Close/Back**: ← or ×
- **Success**: ✓ (checkmark)
- **Error**: ⚠ or ❌
- **Settings**: ⚙
- **User Profile**: 👤
- **Agent**: 🤖 or custom avatar

---

## Spacing System

### Base Unit: 4px

- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px
- **3xl**: 64px

### Component Spacing
- **Section Padding**: 24px (desktop), 16px (mobile)
- **Card Padding**: 16px-24px
- **Button Padding**: 12px 24px
- **Input Padding**: 12px 16px
- **Element Margins**: 8px-16px

---

## Shadows & Depth

### Elevation Levels
```css
- **Level 0** (Flat): none
- **Level 1** (Card): 0 1px 3px rgba(0,0,0,0.1)
- **Level 2** (Raised): 0 4px 6px rgba(0,0,0,0.1)
- **Level 3** (Modal): 0 10px 15px rgba(0,0,0,0.1)
- **Level 4** (Popup): 0 20px 25px rgba(0,0,0,0.15)
```

### Usage
- Sidebar: Level 2
- Message bubbles: Level 1
- Form builder: Level 2
- Buttons (hover): Level 1
- Dropdowns: Level 3

---

## Animations & Transitions

### Timing Functions
- **Default**: `cubic-bezier(0.4, 0, 0.2, 1)` - Ease-in-out
- **Entrance**: `cubic-bezier(0, 0, 0.2, 1)` - Ease-out
- **Exit**: `cubic-bezier(0.4, 0, 1, 1)` - Ease-in

### Durations
- **Fast**: 150ms - Hover states, focus
- **Normal**: 300ms - Slide in/out, expand/collapse
- **Slow**: 500ms - Page transitions, complex animations

### Key Animations

**Sidebar Toggle**:
```
- Transform: translateX(-100%) to translateX(0)
- Duration: 300ms
- Timing: ease-in-out
```

**Form Builder Slide**:
```
- Transform: translateX(100%) to translateX(0)
- Duration: 300ms
- Timing: ease-in-out
```

**Message Appearance**:
```
- Opacity: 0 to 1
- Transform: translateY(10px) to translateY(0)
- Duration: 200ms
- Timing: ease-out
```

**Loading Dots**:
```
- Animation: pulse
- Duration: 1.5s infinite
- Delay: Stagger 200ms between dots
```

---

## Interactions & States

### Buttons

**Primary Button**:
- Default: Primary Blue background, White text
- Hover: Primary Dark background, slight lift (2px up)
- Active: Darker, slight scale (0.98)
- Disabled: Gray 300 background, Gray 400 text
- Focus: 3px outline Primary Light

**Secondary Button**:
- Default: Gray 100 background, Gray 900 text
- Hover: Gray 200 background
- Border: 1px solid Gray 300

**Ghost Button**:
- Default: Transparent, Gray 600 text
- Hover: Gray 100 background

### Input Focus States
```
- Default: Border Gray 200
- Hover: Border Gray 300
- Focus: Border 2px Primary Blue, box-shadow Primary Light
- Error: Border Error Red
- Success: Border Success Green, checkmark icon
```

### Hover Animations
- **Scale up**: 1.0 to 1.02 (subtle)
- **Color transition**: 150ms
- **Shadow increase**: Level 1 to Level 2

---

## Responsive Behavior

### Desktop (≥1280px)
- All three sections visible when toggled
- Sidebar: Fixed 280px width
- Chat: Flexible width (remaining space)
- Form Builder: Fixed 400px width

### Tablet (768px - 1279px)
- Sidebar: Overlay (slides over content with backdrop)
- Chat: Full width
- Form Builder: Slides over chat (full width)

### Mobile (<768px)
- Full-screen sections
- Bottom navigation for section switching
- Sidebar: Full-screen overlay
- Form Builder: Full-screen modal

---

## Accessibility (WCAG 2.1 Level AA)

### Color Contrast
- **Body text on white**: Minimum 4.5:1 (Gray 900 on White = 14.8:1)
- **Large text**: Minimum 3:1
- **Interactive elements**: Minimum 3:1

### Focus Indicators
- Visible focus ring on all interactive elements
- 3px outline, Primary Blue color
- Never remove focus styles

### Keyboard Navigation
- Tab order: Logical flow (sidebar → chat input → form)
- Enter: Submit message/form
- Escape: Close sidebar/form builder
- Arrow keys: Navigate conversation list

### Screen Readers
- ARIA labels on all buttons and icons
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for images and file uploads
- Live region for new messages (aria-live="polite")

---

## Component States Summary

### Sidebar
- **Collapsed**: Hidden (width: 0)
- **Expanded**: Visible (width: 280px)
- **Mobile**: Full-screen overlay

### Main Chat
- **Empty**: Welcome screen with sample prompts
- **Active**: Messages + input
- **Loading**: Typing indicator from agent
- **Error**: Error message with retry button

### Form Builder
- **Hidden**: Width: 0, opacity: 0
- **Visible**: Width: 400px, opacity: 1
- **Loading**: Skeleton loaders for fields
- **Submitted**: Success confirmation state

---

## Special Patterns

### Empty States

**No Conversations**:
```
        [💬]
   No conversations yet

   Start a new conversation
   to get assistance

   [+ New Conversation]
```

**No Messages**:
```
        [🤖]
   Hi! I'm your Banking Assistant

   How can I help you today?

   • Apply for a loan
   • Check account balance
   • Make a transfer
```

### Loading States

**Skeleton Loaders**:
- Use animated gradient (shimmer effect)
- Gray 100 to Gray 200
- Duration: 1.5s infinite

**Conversation List Loading**:
```
┌────────────────────────────┐
│ [▭▭▭▭▭▭▭▭▭▭]              │
│ [▭▭▭▭]                     │
├────────────────────────────┤
│ [▭▭▭▭▭▭▭▭▭▭]              │
│ [▭▭▭▭]                     │
└────────────────────────────┘
```

### Error States

**Message Send Failed**:
```
                           ┌─────────────────────┐
                           │ Message text...     │
                           │                     │
                           │ [⚠ Failed • Retry] │
                           └─────────────────────┘
```

**Form Validation Errors**:
```
[❌ Please fix the following errors:]
• Business Name is required
• Loan Amount must be greater than $0
• Upload at least one document
```

---

## Design Tokens Reference

### Colors Object
```javascript
colors: {
  primary: {
    DEFAULT: '#0047AB',
    dark: '#002D6B',
    light: '#E6F0FF'
  },
  secondary: {
    green: '#00A86B',
    gold: '#D4AF37',
    teal: '#008B8B'
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    400: '#9CA3AF',
    600: '#4B5563',
    900: '#111827'
  },
  semantic: {
    error: '#DC2626',
    warning: '#F59E0B',
    info: '#3B82F6',
    success: '#10B981'
  }
}
```

### Spacing Object
```javascript
spacing: {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px'
}
```

---

## Implementation Notes

### Technology Stack Recommendations
- **Framework**: React 18+ or Next.js 14+
- **Styling**: Tailwind CSS 3+ (with custom config)
- **Icons**: Heroicons or Lucide React
- **Animation**: Framer Motion or CSS transitions
- **Form**: React Hook Form + Zod validation
- **State Management**: Zustand or Context API
- **File Upload**: React Dropzone

### Key Libraries
- `@headlessui/react` - Accessible UI components
- `framer-motion` - Smooth animations
- `react-hook-form` - Form management
- `date-fns` - Date formatting
- `clsx` or `classnames` - Conditional classes

### Performance Considerations
- Virtual scrolling for long conversation lists (react-window)
- Lazy loading for form builder
- Debounced input for real-time validation
- Optimistic UI updates for better UX
- Memoize heavy components (React.memo)

---

## User Flow Example

1. **User Opens App**
   - Sidebar shows previous conversations
   - Main section shows welcome message
   - Form builder is hidden

2. **User Creates New Conversation**
   - Clicks "+ New Conversation" in sidebar
   - New conversation added to list (active state)
   - Chat area shows greeting from agent

3. **User Uploads File & Sends Message**
   - Clicks attachment button
   - Selects file (appears in preview area)
   - Types message and clicks send
   - Message appears in chat (right-aligned)
   - Agent shows loading indicator

4. **Agent Processes & Responds**
   - Agent message appears (left-aligned)
   - If form needed, shows "View Form Builder" CTA
   - User clicks CTA

5. **Form Builder Opens**
   - Slides in from right (300ms animation)
   - Shows pre-filled form with extracted data
   - Fields have success indicators if auto-filled

6. **User Reviews & Submits Form**
   - User reviews/edits fields
   - Validation happens on blur and submit
   - Clicks "Submit Form"
   - Form builder shows success state
   - Agent confirms in chat
   - Form builder can close or stay open for edits

---

## Branding Elements

### Logo Placement
- Top-left of header (if needed)
- Size: 32×32px icon + wordmark
- Color: Primary Blue

### Banking Trust Indicators
- Security badge: Small lock icon in header
- Encryption notice: Footer of form builder
- Compliance text: "FDIC Insured | Secure | Encrypted"

### Tone of Voice
- Professional yet friendly
- Clear and concise
- Reassuring (especially for financial transactions)
- Use of "your" instead of "the" (e.g., "your account" not "the account")

---

## Future Enhancements

### Phase 2 Features
- Dark mode toggle (inverted color palette)
- Multi-language support
- Voice input for messages
- PDF preview within chat
- Export conversation as PDF
- Collaborative forms (multiple users)

### Advanced Interactions
- Inline editing of form fields in chat
- Drag-and-drop to reorder conversation items
- Conversation search and filter
- Saved form templates
- Analytics dashboard

---

This design specification provides a comprehensive foundation for building a professional, accessible, and user-friendly banking agent assistant interface. The color palette emphasizes trust and security while maintaining a modern, approachable aesthetic suitable for financial services.
