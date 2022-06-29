module.exports = {
  content: [
    './**/*.php',
    './src/js/*.js',
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      fontSize: ['rfs'],
      lineHeight: ['rfs'],
      padding: ['rfs'],
      margin: ['rfs'],
      gap: ['rfs'],
      space: ['rfs'],
      width: ['rfs'],
      minWidth: ['rfs'],
      maxWidth: ['rfs'],
      height: ['rfs'],
      minHeight: ['rfs'],
      maxHeight: ['rfs'],
      borderRadius: ['rfs'],
      inset: ['rfs'],
      translate: ['rfs'],
  },
  },
  plugins: [
  require("tailwindcss-rfs"),
  require("@tailwindcss/forms"),
  require("@tailwindcss/aspect-ratio"),
  require("tailwindcss-debug-screens"),
],
}
