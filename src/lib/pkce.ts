import { Sha256 } from "@aws-crypto/sha256-browser";

const generateRandomString = (length: number): string => {
	const possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const values = crypto.getRandomValues(new Uint8Array(length));
	return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const hash = new Sha256();
	hash.update(data);
	const digest = await hash.digest();
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
}

export { generateCodeChallenge, generateRandomString };
