/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/views/layouts/*.hbs",
    "./src/views/*.hbs",
    "./src/views/partials/*.hbs",
    "./src/public/js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'nav': '#1a1a1a',
        'modal': '#000c',
      },
      borderWidth: {
        '1': '1px'
      }
    },
  },
  plugins: [],
}

