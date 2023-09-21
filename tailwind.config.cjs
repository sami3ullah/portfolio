/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"primary": "#B1FC00",
				"secondary": "#AAAAAA",
				"secondaryOpacity": "#131313",
				// "otherColor": "#DB6344",
				"textDull": "#FFFFFFCC",
				"textLight": "#FFFFFF",
				"darkBackground": "#292929",
				"darkBackground2": "#303427",
				"background": "#000000",
			},
			backgroundImage: {
				"hero-image": "url('./hero-image.png')",
			}
		}
	},
	plugins: [],
}
