// tailwind.config.js
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'golden': '#BE8E4A',
        'dark-golden': '#75501D',
        'light-golden': '#E2BA85',
      },
      backgroundImage: theme => ({
        'drogon': "url('@/assets/wallpaper-drogon.jpg')",
      })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}