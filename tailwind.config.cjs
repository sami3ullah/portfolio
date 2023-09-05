/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"primary": "#DB6344",
				"textDull": "#B5AB9A",
				"textLight": "#AAAAAA"
			}
		}
	},
	plugins: [],
}
