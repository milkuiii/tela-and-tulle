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
        }
      },
      fontFamily: {
        sans: ['Helvetica', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
