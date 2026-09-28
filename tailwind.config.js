/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-base': '#07090E',
        'dark-surface': '#0F131C',
        'dark-card': '#151A26',
        volt: {
          DEFAULT: '#CCFF00',
          hover: '#B8E600',
          glow: 'rgba(204, 255, 0, 0.25)',
          contrast: '#07090E'
        },
        'dark-border': 'rgba(255, 255, 255, 0.08)'
      }
    },
  },
  plugins: [],
}
