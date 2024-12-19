import { ensureAccessToken } from "$lib/auth";
import { getPalette } from "$lib/color";
import { getLyrics } from "$lib/lyrics";
import { type Track, track } from "$lib/stores/track";

let currentTrack: Track | null = null;

track.subscribe((value) => {
	currentTrack = value;
});

export async function newTrack(): Promise<boolean> {
	// Update current track and return true if it's a new track

	const token = await ensureAccessToken();

	const response = await fetch(
		"https://api.spotify.com/v1/me/player/currently-playing",
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);

	if (!response.ok) {
		return false;
	}

	if (response.status === 204) {
		track.set(null);
		return false;
	}

	let data: any;

	try {
		data = await response.json();
	} catch {
		return false;
	}

	if (currentTrack && data.item.id === currentTrack.id) {
		// Update current track
		track.update((t) => ({
			...t!,
			is_playing: data.is_playing,
			progress_ms: data.progress_ms,
		}));

		return false;
	}

	// Get new track
	const palette = await getPalette(data.item.album.images[0].url, 2);
	const lyrics = await getLyrics(data.item.id);

	track.set({
		id: data.item.id,
		name: data.item.name,
		artist: data.item.artists[0].name,
		album: data.item.album.name,
		imageUrl: data.item.album.images[0].url,
		is_playing: data.is_playing,
		progress_ms: data.progress_ms,
		duration_ms: data.item.duration_ms,
		palette,
		lyrics,
	});

	return true;
}
