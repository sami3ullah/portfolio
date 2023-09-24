/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#B1FC00',
        // secondary: '#4F27E9',
        secondary: '#C084FC',
        tertiary: '#AAAAAA',
        secondaryOpacity: '#131313',
        // "otherColor": "#DB6344",
        textDull: '#FFFFFFCC',
        textLight: '#FFFFFF',
        hr: '#2F2F2FB2',
        darkBackground: '#292929',
        darkBackground2: '#303427',
        background: '#0D0D0D',
      },
      backgroundImage: {
        'hero-image': "url('./hero-image.webp')",
      },
      margin: {
        pageBottom: '3.5rem',
        pageBottomTab: '5.5rem',
        aboutPageBottom: '110px',
      },
      padding: {
        pageX: '70px',
        pageXMobile: '20px',
      },
    },
  },
  plugins: [],
};
