/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'caveat': ['Caveat', 'cursive'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      colors: {
        'primary': {
          DEFAULT: '#FF6B6B',
          dark: '#E55A5A',
        },
        'secondary': '#2D3436',
        'accent': '#f8f8f8',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'slideInUp': 'slideInUp 0.5s ease-out',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
} 