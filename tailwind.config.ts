import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NuSkin-inspired color palette
        nuskin: {
          primary: '#003B5C',      // Deep Blue
          secondary: '#0077A8',    // Teal Blue
          accent: '#00A9E0',       // Bright Cyan
          light: '#E8F4F8',        // Light Blue Tint
          dark: '#001F2E',         // Dark Navy
          gold: '#C4A962',         // Gold Accent
          success: '#2E8B57',      // Success Green
          warning: '#F5A623',      // Warning Amber
          error: '#D94F4F',        // Error Red
        },
        background: {
          primary: '#F8FBFC',
          secondary: '#FFFFFF',
          tertiary: '#EDF5F8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 59, 92, 0.07), 0 10px 20px -2px rgba(0, 59, 92, 0.04)',
        'glow': '0 0 20px rgba(0, 169, 224, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 59, 92, 0.1), 0 2px 4px -1px rgba(0, 59, 92, 0.06)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(135deg, #003B5C 0%, #0077A8 50%, #00A9E0 100%)',
      },
    },
  },
  plugins: [],
};

export default config;

