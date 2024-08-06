/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'spread-out': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(60px)', opacity: 1 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        scaleUpDown: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%) scale(0.8)', opacity: 0 },
          '100%': { transform: 'translateX(0) scale(1)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        rotateIn: {
          '0%': { transform: 'rotate(-360deg)', opacity: 0 },
          '100%': { transform: 'rotate(0deg)', opacity: 1 },
        },
      },
      animation: {
        'spread-out': 'spread-out 1s ease-out forwards',
        slideDown: 'slideDown 0.5s ease-out',
        slideUp: 'slideUp 1s ease-out',
        scaleUpDown: 'scaleUpDown 2s infinite',
        slideIn: 'slideIn 1.5s ease-out forwards',
        fadeIn: 'fadeIn 1.5s ease-out forwards',
        rotateIn: 'rotateIn 1.5s ease-out forwards',
      },
    },
    fontFamily: {
      Cafe24Ssurround: ["Cafe24Ssurround"],
      KoPubDotum: ["KoPub Dotum"],
    },
  },
  plugins: [],
}
