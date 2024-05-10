/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',

  theme: {
    colors: {
      primaryDark:'#4682b4',
      primaryLight:'#b0c4de',
    primaryDarkText:'#e0e6ed',
    primarylightText:'#1f2d3d',
    primaryDarkBackground:'hsl(214, 19%, 29%)'
,    primaryLightBackground:'hsl(210, 26%, 91%)'

    
  },

  plugins: [],
}}