import { i18n } from "$lib/i18n";
import { redirect } from "$lib/location";
import { generateCodeChallenge, generateRandomString } from "$lib/pkce";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

export async function redirectToSpotify() {
	const codeVerifier = generateRandomString(128);
	const codeChallenge = await generateCodeChallenge(codeVerifier);

	localStorage.setItem("spotify_code_verifier", codeVerifier);

	const params = new URLSearchParams({
		response_type: "code",
		client_id: CLIENT_ID,
		scope: "user-read-currently-playing user-read-playback-state",
		code_challenge_method: "S256",
		code_challenge: codeChallenge,
		redirect_uri: REDIRECT_URI,
		state: i18n.getLanguageFromUrl(new URL(location.href)),
	});

	redirect(`${SPOTIFY_AUTH_URL}?${params.toString()}`);
}

export async function getAccessToken(authCode: string): Promise<string> {
	const codeVerifier = localStorage.getItem("spotify_code_verifier");
	if (!codeVerifier) {
		throw new Error("Code verifier is missing.");
	}

	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		grant_type: "authorization_code",
		code: authCode,
		code_verifier: codeVerifier,
		redirect_uri: REDIRECT_URI,
	});

	const body = await fetch(`/api/token?${params}`);
	const response = await body.json();

	if (!response.access_token) {
		throw new Error("Failed to get access token");
	}

	localStorage.setItem("spotify_access_token", response.access_token);
	localStorage.setItem("spotify_refresh_token", response.refresh_token);
	localStorage.setItem(
		"spotify_token_expires_at",
		(Date.now() + response.expires_in * 1000).toString(),
	);
	return response.access_token;
}

export async function refreshToken() {
	const refreshToken = localStorage.getItem("spotify_refresh_token");
	if (!refreshToken) {
		throw new Error("Refresh token is missing.");
	}

	const params = new URLSearchParams({
		client_id: CLIENT_ID,
		grant_type: "refresh_token",
		refresh_token: refreshToken,
	});

	const body = await fetch(`/api/refresh?${params}`);
	const response = await body.json();

	if (!response.access_token) {
		throw new Error("Failed to refresh token");
	}

	localStorage.setItem("spotify_access_token", response.access_token);
	localStorage.setItem("spotify_refresh_token", response.refresh_token);
	localStorage.setItem(
		"spotify_token_expires_at",
		(Date.now() + response.expires_in * 1000).toString(),
	);
}

export async function ensureAccessToken(): Promise<string> {
	const accessToken = localStorage.getItem("spotify_access_token");
	const expiresAt = Number.parseInt(
		localStorage.getItem("spotify_token_expires_at") || "0",
		10,
	);

	if (!accessToken || Date.now() >= expiresAt) {
		await refreshToken();
	}

	return localStorage.getItem("spotify_access_token")!;
}

export async function logout() {
	localStorage.removeItem("spotify_access_token");
	localStorage.removeItem("spotify_refresh_token");
	localStorage.removeItem("spotify_token_expires_at");
}
