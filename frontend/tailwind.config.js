/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  // Use class strategy so we can toggle dark mode globally
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}

