/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Fresh Sage Color Scheme
        primary: {
          DEFAULT: '#4A7C59',
          light: '#6B9B7A',
          dark: '#3A6247',
        },
        accent: {
          DEFAULT: '#E07A5F',
          light: '#E8927A',
          dark: '#C96A50',
        },
        sage: {
          50: '#FAFAF8',
          100: '#F5F5F2',
          200: '#E8EDE8',
          300: '#D4DDD4',
          400: '#9BA89B',
          500: '#6B7B6B',
          600: '#4A5A4A',
          700: '#3A423A',
          800: '#252A25',
          900: '#1A1D1A',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

