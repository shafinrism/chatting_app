/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#96E9C6',
        'secondary': '#6962AD',
        'tertiary' : '#83C0C1',
        'fourth' : '#fcc419',
      },
      fontFamily: {
        'Josefin': ['Josefin Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

