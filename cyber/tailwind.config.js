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
        mono: ['Space Grotesk', 'monospace'], // Using Space Grotesk for "mono" slot for headings/tech feel
      },
      colors: {
        cyber: {
          blue: '#0055FF', // Sharper electric blue
          dark: '#0F172A',
          grey: '#F1F5F9',
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
