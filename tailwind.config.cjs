/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#D5FF3F',
        purple: '#4F27E9',
        tertiary: '#95997e',
        secondaryOpacity: '#131313',
        textLightPrimary: "#b9bcad",
        textDullest: '#5e6051',
        textLight: '#FFFFFF',
        hr: '#2F2F2FB2',
        darkBackground: '#101110',
        darkBorder: "#252621",
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
