/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Exo 2"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Inter"', '"Work Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Core backgrounds
        void: '#0a0e17',
        space: '#0f1628',
        midnight: '#151d35',
        abyss: '#1a2342',
        
        // Primary - Electric Cyan
        cyber: {
          50: '#e6fdff',
          100: '#b3f8ff',
          200: '#66f1ff',
          300: '#1ae8ff',
          400: '#00d4ff',
          500: '#00b8db',
          600: '#0094b8',
          700: '#006b8a',
          800: '#004a5c',
          900: '#002a35',
        },
        
        // Status colors
        pulse: {
          DEFAULT: '#00ff88',
          dim: '#00cc6a',
          glow: 'rgba(0, 255, 136, 0.4)',
        },
        warning: {
          DEFAULT: '#ffaa00',
          dim: '#cc8800',
          glow: 'rgba(255, 170, 0, 0.4)',
        },
        danger: {
          DEFAULT: '#ff3366',
          dim: '#cc2952',
          glow: 'rgba(255, 51, 102, 0.4)',
        },
        
        // Text colors
        ghost: '#e8f4ff',
        steel: '#5a6a8a',
        mist: '#8899bb',
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(0, 212, 255, 0.3)',
        'glow': '0 0 25px -5px rgba(0, 212, 255, 0.4)',
        'glow-lg': '0 0 40px -5px rgba(0, 212, 255, 0.5)',
        'glow-pulse': '0 0 25px -5px rgba(0, 255, 136, 0.4)',
        'card': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 25px 50px -12px rgba(0, 212, 255, 0.15)',
        'inner-glow': 'inset 0 1px 0 0 rgba(0, 212, 255, 0.1)',
      },
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2300d4ff' stroke-opacity='0.03' stroke-width='1'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'radial-glow': 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
        'radial-glow-tl': 'radial-gradient(ellipse at top left, rgba(0, 212, 255, 0.12) 0%, transparent 50%)',
        'radial-glow-br': 'radial-gradient(ellipse at bottom right, rgba(0, 255, 136, 0.08) 0%, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { boxShadow: '0 0 20px -5px rgba(0, 212, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px -5px rgba(0, 212, 255, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
