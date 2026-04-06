import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4D00',
          50: '#fff3ee',
          100: '#ffe4d5',
          200: '#ffc4a3',
          300: '#ff9a6a',
          400: '#ff6b30',
          500: '#FF4D00',
          600: '#e63d00',
          700: '#bf2d00',
          800: '#992500',
          900: '#7a1f00',
        },
        secondary: {
          DEFAULT: '#1A1A2E',
          50: '#f0f0f5',
          100: '#d9d9e8',
          200: '#b3b3d1',
          300: '#8080b3',
          400: '#4d4d8f',
          500: '#1A1A2E',
          600: '#141428',
          700: '#0f0f1e',
          800: '#0a0a14',
          900: '#05050a',
        },
        accent: {
          DEFAULT: '#00D4AA',
          50: '#e6faf7',
          100: '#b3f0e6',
          200: '#80e6d5',
          300: '#4ddcc4',
          400: '#1ad2b3',
          500: '#00D4AA',
          600: '#00b892',
          700: '#009c7a',
          800: '#008062',
          900: '#00644a',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
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
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
        'gradient-orange': 'linear-gradient(135deg, #FF4D00 0%, #FF8C42 100%)',
      },
    },
  },
  plugins: [],
}

export default config
