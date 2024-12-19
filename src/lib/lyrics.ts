import type { Lyrics } from "$lib/stores/lyrics";

export async function getLyrics(track_id: string): Promise<Lyrics | null> {
	const response = await fetch(
		`/api/lyrics?track_id=${encodeURIComponent(track_id)}`,
	);

	if (!response.ok) {
		return null;
	}

	try {
		return await response.json();
	} catch {
		return null;
	}
}
