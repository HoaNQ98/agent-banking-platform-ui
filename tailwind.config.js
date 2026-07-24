/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm clay accent — tuned to feel like the Claude reference UI
        primary: {
          DEFAULT: '#BC6E4E',
          dark: '#A85E3E',
          light: '#F3E7DF',
        },
        secondary: {
          green: '#00A86B',
          gold: '#D4AF37',
          teal: '#008B8B',
        },
        // Warm-tinted neutrals (a slight bias toward the clay accent)
        canvas: '#FAF9F6',
        surface: '#F5F3EE',
        blush: '#F6ECE4',
        gray: {
          50: '#FAF9F6',
          100: '#F5F3EE',
          200: '#EDE9E1',
          300: '#E4DFD5',
          400: '#B7B0A3',
          600: '#8A8578',
          900: '#3A3733',
        },
        semantic: {
          error: '#DC2626',
          warning: '#F59E0B',
          info: '#3B82F6',
          success: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'monospace'],
      },
      fontSize: {
        hero: ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        h4: ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        body: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        small: ['12px', { lineHeight: '1.4', fontWeight: '400' }],
        tiny: ['10px', { lineHeight: '1.3', fontWeight: '500' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      boxShadow: {
        'level-0': 'none',
        'level-1': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'level-2': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'level-3': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'level-4': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '18px',
        xl: '20px',
        full: '50%',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        'ease-default': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-entrance': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-exit': 'cubic-bezier(0.4, 0, 1, 1)',
      },
      keyframes: {
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'slide-in-left': 'slide-in-left 300ms ease-default',
        'slide-in-right': 'slide-in-right 300ms ease-default',
        'fade-in-up': 'fade-in-up 200ms ease-entrance',
        'pulse-slow': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}
