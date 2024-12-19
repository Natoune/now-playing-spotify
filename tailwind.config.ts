import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		extend: {},

		fontFamily: {
			sans: [
				"SpotifyMixUI",
				"Helvetica Neue",
				"helvetica",
				"arial",
				"Hiragino Kaku Gothic ProN",
				"Meiryo",
				"MS Gothic",
				"sans-serif",
			],
			title: [
				"SpotifyMixUITitle",
				"Helvetica Neue",
				"helvetica",
				"arial",
				"Hiragino Kaku Gothic ProN",
				"Meiryo",
				"MS Gothic",
				"sans-serif",
			],
		},
	},

	plugins: [],
} satisfies Config;
