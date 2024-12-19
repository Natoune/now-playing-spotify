import { json } from "@sveltejs/kit";

const SPOTIFY_TOKEN_URL = "https://open.spotify.com/get_access_token";
const SPOTIFY_LYRICS_URL =
	"https://spclient.wg.spotify.com/color-lyrics/v2/track";
const USER_AGENT =
	"Now Playing Spotify (https://github.com/Natoune/now-playing-spotify)";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const track_id = url.searchParams.get("track_id");

	if (!track_id) {
		return json({ error: "Missing required parameters" }, { status: 400 });
	}

	let params = new URLSearchParams({
		reason: "transport",
		productType: "web_player",
	});

	let response = await fetch(`${SPOTIFY_TOKEN_URL}?${params}`, {
		headers: {
			"User-Agent": USER_AGENT,
			Cookie: `sp_dc=${import.meta.env.VITE_SPOTIFY_SP_DC}`,
		},
	});

	if (!response.ok) {
		return json(
			{ error: "Failed to fetch Spotify access token" },
			{ status: response.status },
		);
	}

	let token: string;
	try {
		token = (await response.json()).accessToken;
	} catch {
		return json(
			{ error: "Failed to parse Spotify access token" },
			{ status: 500 },
		);
	}

	params = new URLSearchParams({
		format: "json",
		vocalRemoval: "false",
		market: "from_token",
	});

	response = await fetch(`${SPOTIFY_LYRICS_URL}/${track_id}?${params}`, {
		headers: {
			"app-platform": "WebPlayer",
			"User-Agent": USER_AGENT,
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		return json(
			{ error: "Failed to fetch lyrics" },
			{ status: response.status },
		);
	}

	try {
		const data = await response.json();
		return json({
			colors: data.colors,
			lyrics: {
				lines: data.lyrics.lines.map((line: any) => ({
					endTimeMs: line.endTimeMs,
					startTimeMs: line.startTimeMs,
					words: line.words,
				})),
				providerDisplayName: data.providerDisplayName,
				syncType: data.syncType,
			},
		});
	} catch {
		return json({ error: "Failed to parse response" }, { status: 500 });
	}
}
