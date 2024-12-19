<script lang="ts">
	import { signedIntToRGBA } from '$lib/color';
	import * as m from '$lib/paraglide/messages.js';
	import { type Track, track } from '$lib/stores/track';
	import { onMount } from 'svelte';

	function scroll(track: Track | null) {
		if (track?.lyrics) {
			const currentLine = document.querySelector(
				`[data-start-time="${
					track.lyrics.lyrics.lines.find((line) => Number(line.startTimeMs) > track.progress_ms)
						?.startTimeMs
				}"]`
			);

			if (currentLine) {
				currentLine.scrollIntoView({
					behavior: 'smooth',
					block: 'center'
				});
			} else {
				const lastLine = document.querySelector(
					`[data-start-time="${track.lyrics.lyrics.lines.slice(-1)[0].startTimeMs}"]`
				);

				if (lastLine) {
					lastLine.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					});
				}
			}
		}
	}

	track.subscribe((value) => scroll(value));

	onMount(() => {
		scroll($track);
	});
</script>

{#if $track?.lyrics}
	<div
		style="background-color: {signedIntToRGBA($track.lyrics.colors.background)}"
		class="no-scrollbar pointer-events-none z-10 h-[65vh] w-1/2 overflow-y-auto rounded-lg px-[4vw] py-[4vh] max-xl:hidden 2xl:rounded-3xl"
	>
		{#each $track.lyrics.lyrics.lines as line}
			<p
				data-start-time={line.startTimeMs}
				style="color: {signedIntToRGBA(
					$track.progress_ms >= Number(line.startTimeMs)
						? $track.lyrics.colors.highlightText
						: $track.lyrics.colors.text
				)}"
				class:opacity-50={$track.progress_ms >
					Number(
						$track.lyrics.lyrics.lines[$track.lyrics.lyrics.lines.indexOf(line) + 1]?.startTimeMs
					)}
				class="py-[1.8vh] text-left text-3xl font-bold leading-normal transition-all duration-500 2xl:text-[4vh]"
			>
				{line.words}
			</p>
		{/each}
	</div>
{:else}
	<div
		class="no-scrollbar pointer-events-none z-10 flex h-[65vh] w-1/2 items-center justify-center rounded-lg bg-[#333] px-[4vw] py-[4vh] 2xl:rounded-3xl"
	>
		<p
			class="py-[1.8vh] text-center text-3xl font-bold leading-normal transition-all duration-500 2xl:text-[4vh]"
		>
			{m.no_lyrics()}
		</p>
	</div>
{/if}
