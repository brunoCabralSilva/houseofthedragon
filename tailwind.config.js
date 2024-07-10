// tailwind.config.js
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        'pulse-1': 'pulse 1s linear infinite',
        'pulse-2': 'pulse 2s linear infinite',
        'pulse-3': 'pulse 3s linear infinite',
      },
      colors: {
        'golden': '#BE8E4A',
        'dark-golden': '#75501D',
        'hard-dark-golden': '#473113',
        'light-golden': '#E2BA85',
        'gray-whats': '#202C33',
        'green-whats': '#005C4B',
      },
      height: {
        '20vh': '20vh',
        '30vh': '30vh',
        '40vh': '40vh',
        '50vh': '50vh',
        '60vh': '60vh',
        '70vh': '70vh',
        '80vh': '80vh',
        '90vh': '90vh',
        '95vh': '95vh',
      },
      width: {
        '20vw': '20vw',
        '30vw': '30vw',
        '40vw': '40vw',
        '50vw': '50vw',
        '95vw': '95vw',
      },
      backgroundImage: theme => ({
        'drogon': "url('@/assets/wallpaper-drogon.jpg')",
        'arena': "url('@/assets/arena.png')",
      })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}