/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blue: {
          400: '#4B93FF',
          500: '#0066FF',
          600: '#0055D4',
          700: '#0044A8',
          800: '#00337C',
          900: '#002255',
        },
        teal: {
          400: '#2CCEC9',
          500: '#00B5AD',
          600: '#00958E',
          700: '#00756F',
          800: '#005550',
          900: '#003A36',
        },
        purple: {
          400: '#8871DB',
          500: '#6B46C1',
          600: '#57389B',
          700: '#442B76',
          800: '#301E52',
          900: '#1D122D',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
};