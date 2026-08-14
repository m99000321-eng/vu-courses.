/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#6C2BD9',
          'purple-hover': '#5B21B6',
          'purple-light': '#F3E8FF',
          orange: '#F97316',
          'orange-hover': '#EA580C',
          'orange-light': '#FFEDD5',
        },
      },
    },
  },
  plugins: [],
}
