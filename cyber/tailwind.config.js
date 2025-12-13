/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        cyber: {
          blue: '#00FF41',
          green: '#00FF41',
          dark: '#000000',
          grey: '#111111',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #003300 1px, transparent 1px), linear-gradient(to bottom, #003300 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
