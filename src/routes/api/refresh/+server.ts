import { json } from "@sveltejs/kit";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const client_id = url.searchParams.get("client_id");
	const grant_type = url.searchParams.get("grant_type");
	const refresh_token = url.searchParams.get("refresh_token");

	if (!refresh_token || !client_id || !grant_type) {
		return json({ error: "Missing required parameters" }, { status: 400 });
	}

	const params = new URLSearchParams({
		client_id,
		grant_type,
		refresh_token,
	});

	const response = await fetch(SPOTIFY_TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: params.toString(),
	});

	if (!response.ok) {
		return json(
			{ error: "Failed to fetch token" },
			{ status: response.status },
		);
	}

	try {
		return json(await response.json());
	} catch {
		return json({ error: "Failed to parse response" }, { status: 500 });
	}
}
