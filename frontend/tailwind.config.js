/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Work Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f1f6ff',
          100: '#dce9ff',
          200: '#b9d2ff',
          300: '#8ab4ff',
          400: '#5a97ff',
          500: '#3677f8',
          600: '#2158d4',
          700: '#1841a8',
          800: '#153784',
          900: '#13316b',
        },
        accent: '#ffb347',
        slate: {
          950: '#0f1729',
        },
      },
      boxShadow: {
        card: '0 18px 45px -25px rgba(15, 23, 41, 0.45)',
      },
    },
  },
  plugins: [],
};
