/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2F8',
          100: '#D1DFEF',
          200: '#A3BFE0',
          300: '#759FD0',
          400: '#477FC1',
          500: '#1A365D', // Main primary color
          600: '#152D4F',
          700: '#112440',
          800: '#0D1A2F',
          900: '#08101F',
        },
        secondary: {
          50: '#FEFAF2',
          100: '#FDF0D9',
          200: '#FBE1B4',
          300: '#F8D28E',
          400: '#F6C269',
          500: '#C69214', // Main secondary color
          600: '#A57911',
          700: '#84610E',
          800: '#63480A',
          900: '#423007',
        },
        accent: {
          50: '#F2F9FC',
          100: '#D9EEF7',
          200: '#B3DEEF',
          300: '#8DCDE7',
          400: '#66BDDF',
          500: '#40ADD7',
          600: '#2A8AAC',
          700: '#1F6882',
          800: '#154557',
          900: '#0A232B',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};