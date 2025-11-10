/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					"SF Pro Text",
					"-apple-system",
					"BlinkMacSystemFont",
					"Segoe UI",
					"Roboto",
					"sans-serif",
				],
			},
			colors: {
				glass: {
					light: "rgba(255, 255, 255, 0.7)",
					medium: "rgba(255, 255, 255, 0.5)",
					dark: "rgba(255, 255, 255, 0.3)",
				},
			},
			backdropBlur: {
				xs: "2px",
				"3xl": "64px",
				"4xl": "96px",
			},
		},
	},
	plugins: [],
};
