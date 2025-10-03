/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'gotham': ['Gotham', 'sans-serif'],
        'gotham-book': ['Gotham Book', 'sans-serif'],
        'harlow-serif': ['Harlow Duo Serif', 'serif'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'bold': '700',
      },
      colors: {
        'primary': '#a56658',
        'primarydark': '#774d46',
        'primarydark-100': '#4b4139',
        'alt': '#333337',
        'accent': '#A56658',
        'accentDark': '#774D46',
        'light': '#FFFFFF',
        'muted': '#EEE9E6',
        'base': '#333333',
        'burlywood': '#e4c095',
        'darkgray-1': '#b3b3b3',
        'darkgray-2': '#999999',
        'darkolivegreen': '#7c703b',
        'dimgray': '#666666',
        'rosybrown': '#a06856',
        'secondary': '#b78579',
        'silver': '#d6c6b9',
        'tan': '#ab8158',
        'white': '#ffffff',
        'whitesmoke': '#eee9e6',
        'color-4d4d4d': '#4D4D4D',
      }
    },
  },
  plugins: [],
}
