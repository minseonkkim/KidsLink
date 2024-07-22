/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
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
      },
      animation: {
        slideDown: 'slideDown 0.5s ease-out',
        slideUp: 'slideUp 1s ease-out',
        scaleUpDown: 'scaleUpDown 2s infinite',
      },
    },
    fontFamily: {
      Cafe24Ssurround: ["Cafe24Ssurround"],
      KoPubDotum: ["KoPub Dotum"],
    }
  },
  plugins: [],
}
