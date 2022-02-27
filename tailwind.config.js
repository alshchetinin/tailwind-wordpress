module.exports = {
  content: [
    './**/*.php',
    './scr/js/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-debug-screens')
  ],
}
