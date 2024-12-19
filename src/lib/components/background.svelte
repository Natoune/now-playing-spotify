<script lang="ts">
	import { showAlternative } from '$lib/stores/alternative';
	import { track } from '$lib/stores/track';

	let previousGradient: HTMLDivElement;
	let currentGradient: HTMLDivElement;

	let timer = 0;
	let interval: number;

	export function updateGradient(newColors: string[] = ['#121212', '#121212']) {
		if (timer > 0) return;

		currentGradient.style.background = `linear-gradient(45deg, ${newColors[0]}, ${newColors[1]})`;
		currentGradient.style.opacity = '0';
		previousGradient.style.opacity = '1';

		// @ts-ignore
		interval = setInterval(() => {
			timer += 0.01;
			previousGradient.style.opacity = `${1 - timer}`;
			currentGradient.style.opacity = `${timer}`;

			if (timer >= 1) {
				clearInterval(interval);
				timer = 0;
				previousGradient.style.background = `linear-gradient(45deg, ${newColors[0]}, ${newColors[1]})`;
			}
		}, 10);
	}
</script>

{#if $track?.imageUrl}
	<img
		src={$track?.imageUrl}
		alt="Album cover"
		class="absolute inset-0 z-0 h-full w-full object-cover opacity-50"
		class:xl:hidden={!$showAlternative}
	/>
{/if}

<div
	bind:this={previousGradient}
	class="absolute inset-0 z-0 blur-lg max-xl:hidden"
	class:hidden={$showAlternative}
></div>
<div
	bind:this={currentGradient}
	class="absolute inset-0 z-0 blur-lg max-xl:hidden"
	class:hidden={$showAlternative}
></div>
