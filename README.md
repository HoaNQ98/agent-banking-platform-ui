# Banking Agent Assistant - UI Implementation

A modern, professional banking assistant interface built with React, TypeScript, Ant Design, and Tailwind CSS. Features a three-section intelligent layout with dynamic form generation capabilities.

## 🎯 Features

- ✅ **Three-Section Layout**: Sidebar, Main Chat, and Form Builder
- ✅ **Conversation Management**: Create, view, and manage conversations
- ✅ **Real-time Chat Interface**: User and agent message bubbles with file attachments
- ✅ **Dynamic Form Builder**: Auto-populated forms with validation
- ✅ **Responsive Design**: Mobile, tablet, and desktop optimized
- ✅ **State Management**: Zustand for efficient state handling
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Banking Theme**: Professional color palette with trust indicators
- ✅ **Accessibility**: WCAG 2.1 Level AA compliant

## 🚀 Tech Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.3.1
- **UI Library**: Ant Design 5.x
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: Zustand 5.x
- **Form Management**: React Hook Form + Zod validation
- **Icons**: Lucide React + Ant Design Icons
- **Date Handling**: date-fns

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/           # Layout components
│   ├── sidebar/          # Sidebar components
│   ├── chat/             # Chat components
│   ├── form-builder/     # Form builder components
│   └── common/           # Reusable components
├── store/                # Zustand store
├── types/                # TypeScript definitions
├── utils/                # Utility functions
├── constants/            # App constants
├── hooks/                # Custom hooks
├── App.tsx               # App root
└── main.tsx              # Entry point
```

## 🛠️ Installation & Setup

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Creating a New Conversation

1. Click the **"+"** button in the sidebar header
2. Or click **"Start New Conversation"** on the empty state

### Sending Messages

1. Type your message in the input field
2. Press **Enter** to send (Shift+Enter for new line)
3. Click the send button or attach files

### Using the Form Builder

1. Click **"Demo Form"** button in the header to load a sample form
2. Click **"Form Builder"** toggle to open/close the panel
3. Fill in required fields and submit

## 🎨 Design System

See [DESIGN_SPECS.md](DESIGN_SPECS.md) for complete design specifications including:
- Color palette
- Typography
- Spacing system
- Component specifications
- Responsive behavior

## 📱 Responsive Breakpoints

- **Desktop**: ≥1280px - All three sections visible
- **Tablet**: 768px-1279px - Sidebar/Form as overlays
- **Mobile**: <768px - Full-screen sections

---

Built with ❤️ using React, TypeScript, Ant Design, and Tailwind CSS
