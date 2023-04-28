/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'primary': '#172328',
        'primary-light': '#5C6166',
        'primary-dark': '#202224'
      },
    },
  },
  plugins: [],
};
