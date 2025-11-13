/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
        secondary: {
          50: '#f8fafc',
          100: '#e2e8f0',
          200: '#cbd5f5',
          500: '#64748b',
          600: '#475569',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
        },
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(37, 99, 235, 0.35)',
        glow: '0 25px 65px -20px rgba(59, 130, 246, 0.45)',
        subtle: '0 12px 30px -15px rgba(15, 23, 42, 0.35)',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'radial-faded':
          'radial-gradient(120% 120% at 50% 0%, rgba(59, 130, 246, 0.12) 0%, rgba(248, 250, 252, 0.65) 45%, rgba(248, 250, 252, 1) 100%)',
        'conic-highlight':
          'conic-gradient(from 180deg at 50% 50%, rgba(59, 130, 246, 0.25), rgba(148, 163, 184, 0.05), rgba(59, 130, 246, 0.35))',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translate3d(0, 0px, 0)' },
          '50%': { transform: 'translate3d(0, -6px, 0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.45', filter: 'blur(0px)' },
          '50%': { opacity: '0.8', filter: 'blur(2px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'underline-slide': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'right' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.45s ease-out forwards',
        'scale-in': 'scale-in 0.35s ease-out forwards',
        shimmer: 'shimmer 1.25s linear infinite',
        'float-soft': 'float-soft 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'gradient-x': 'gradient-x 12s ease-in-out infinite',
        'underline-slide': 'underline-slide 0.45s ease forwards',
      },
    },
  },
  plugins: [],
}