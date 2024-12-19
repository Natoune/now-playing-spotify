import ColorThief from "colorthief";

export async function getPalette(
	url: string,
	count: number,
): Promise<string[] | null> {
	const image = new Image();
	image.src = url;
	image.crossOrigin = "Anonymous";

	const palette = await new Promise((resolve, reject) => {
		image.onload = () => {
			const colorThief = new ColorThief();
			const palette = colorThief.getPalette(image, count);
			resolve(palette);
		};

		image.onerror = reject;
	});

	if (!Array.isArray(palette)) {
		return null;
	}

	return palette.map((color) => {
		return `#${color.map((c: number) => c.toString(16).padStart(2, "0")).join("")}`;
	});
}

export function signedIntToRGBA(color: number): string {
	const unsignedColor = color >>> 0;

	const a = (unsignedColor >> 24) & 0xff;
	const r = (unsignedColor >> 16) & 0xff;
	const g = (unsignedColor >> 8) & 0xff;
	const b = unsignedColor & 0xff;

	return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}
