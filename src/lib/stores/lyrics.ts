import { writable } from "svelte/store";

export type Lyrics = {
	colors: {
		background: number;
		highlightText: number;
		text: number;
	};
	lyrics: {
		lines: {
			endTimeMs: string;
			startTimeMs: string;
			words: string;
		}[];
		providerDisplayName: string;
		syncType?: "LINE_SYNCED";
	};
};

export const showLyrics = writable(false);
