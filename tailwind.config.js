/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // --- New Design Tokens ---
        wine: {
          DEFAULT: '#B32F4E',
          dark: '#8D2040',
          deeper: '#6B1830',
          light: '#D94E6B',
        },
        sage: {
          DEFAULT: '#8D9A2E',
          dark: '#6D7A1E',
          light: '#A8B83A',
        },
        softPink: {
          DEFAULT: '#FFEEEE',
          dark: '#FFD6DA',
          deeper: '#FFBFC7',
        },
        paleMatcha: {
          DEFAULT: '#F4F7CD',
          dark: '#E8EDAA',
        },
        softRose: {
          DEFAULT: '#FFB5BD',
          dark: '#FF8E99',
          light: '#FFCDD2',
        },
        // --- Legacy Tokens (preserved for status badges) ---
        rose: {
          50: '#FDF6F7',
          100: '#FCEBEF',
          200: '#F7D4DE',
          300: '#EEACC0',
          400: '#E27B9B',
          500: '#D14D76',
          600: '#B8325C',
          700: '#9E2A4B',
          800: '#7A1C3E',
          900: '#521028',
          950: '#2D0A16',
        },
        burgundy: {
          DEFAULT: '#7A1C3E',
          deep: '#420D20',
        },
        gold: {
          50: '#FDFBF7',
          100: '#F7F2E6',
          300: '#E5D3A1',
          500: '#D4AF37',
          600: '#C5A059',
          700: '#9A7B39',
        },
        luxury: {
          dark: '#121013',
          card: '#1C191E',
          border: '#2E2A32',
          lightBg: '#FAF8F5',
          lightCard: '#FFFFFF',
        },
      },
      fontFamily: {
        // Headings: Alegreya SC (Google Fonts) — elegant high-fashion serif
        display: ['Times New Roman', 'serif'],
        // Body / UI: Helvetica / Alte Haas Grotesk sans-serif stack
        sans: ['Helvetica', 'Arial', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'rose-glow': '0 0 30px 0 rgba(255, 181, 189, 0.4)',
        'wine-glow': '0 0 20px 0 rgba(179, 47, 78, 0.25)',
        'soft': '0 4px 32px 0 rgba(179, 47, 78, 0.06)',
        'glass': '0 8px 32px 0 rgba(179, 47, 78, 0.08)',
      },
    },
  },
  plugins: [],
}
