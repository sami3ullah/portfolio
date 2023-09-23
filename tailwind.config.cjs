/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"primary": "#B1FC00",
				"secondary": "#4F27E9",
				"tertiary": "#AAAAAA",
				"secondaryOpacity": "#131313",
				// "otherColor": "#DB6344",
				"textDull": "#FFFFFFCC",
				"textLight": "#FFFFFF",
				"hr": "#2F2F2FB2",
				"darkBackground": "#292929",
				"darkBackground2": "#303427",
				"background": "#000000",
			},
			backgroundImage: {
				"hero-image": "url('./hero-image.webp')",
			},
			margin: {
				"pageBottom": "3.5rem",
				"aboutPageBottom": "110px"
			},
			padding: {
				"pageX": "70px"
			}
		}
	},
	plugins: [],
}
