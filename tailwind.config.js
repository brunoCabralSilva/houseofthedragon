// tailwind.config.js
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'golden': '#BE8E4A',
        'dark-golden': '#75501D',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
