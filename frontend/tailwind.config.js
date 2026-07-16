/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#2d6a4f',
          700: '#1a5c40',
          800: '#14532d',
          900: '#1a3c2e',
          950: '#0f2318',
        },
        'gold': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4a017',
          600: '#b8860b',
          700: '#92650a',
          800: '#78430d',
          900: '#62360f',
        },
        'cream': '#fdf6ec',
        'brown': {
          300: '#c8956b',
          500: '#8b5e3c',
          700: '#5c3317',
          900: '#3b1d0a',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f2318 0%, #1a3c2e 50%, #2d6a4f 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4a017 0%, #f59e0b 100%)',
        'nature-gradient': 'linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 100%)',
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(45, 106, 79, 0.4)',
        'glow-gold': '0 0 20px rgba(212, 160, 23, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
