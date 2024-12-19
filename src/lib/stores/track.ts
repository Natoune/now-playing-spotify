import type { Lyrics } from "$lib/stores/lyrics";
import { writable } from "svelte/store";

export type Track = {
	id: string;
	name: string;
	artist: string;
	album: string;
	imageUrl: string;
	is_playing: boolean;
	progress_ms: number;
	duration_ms: number;
	palette: string[] | null;
	lyrics: Lyrics | null;
};

export const track = writable<Track | null>(null);
