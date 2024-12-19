export function formatDuration(ms: number) {
	const seconds = Math.floor(ms / 1000) % 60;
	const minutes = Math.floor(ms / 1000 / 60);

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
