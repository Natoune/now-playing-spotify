<script lang="ts">
	import NoCover from '$lib/components/svg/no-cover.svelte';
	import Pause from '$lib/components/svg/pause.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { showAlternative } from '$lib/stores/alternative';
	import { track } from '$lib/stores/track';
	import { formatDuration } from '$lib/time';
</script>

<div
	class="z-10 space-y-[2vh] xl:w-1/2"
	class:mx-auto={!$showAlternative}
	class:xl:text-center={!$showAlternative}
	class:pr-16={$showAlternative}
>
	<div
		class="relative mx-auto w-1/2 rounded-lg shadow-lg max-xl:hidden 2xl:rounded-3xl"
		class:hidden={$showAlternative}
	>
		{#if $track?.imageUrl}
			<img
				src={$track.imageUrl}
				alt={$track.album}
				class="w-full rounded-lg 2xl:rounded-3xl"
				class:opacity-50={!$track.is_playing}
				onerror={() => ($track!.imageUrl = '')}
			/>
		{:else}
			<NoCover className="w-full h-[200%] rounded-lg 2xl:rounded-3xl" />
		{/if}

		{#if $track && !$track.is_playing}
			<div
				class="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50"
			>
				<Pause className="h-1/4 w-1/4" />
			</div>
		{/if}
	</div>

	<h2 class="font-title text-[8vh]" class:xl:text-[4vh]={!$showAlternative}>
		{$track?.name || m.nothing_playing()}
	</h2>
	<p class="text-[4vh]" class:xl:text-[3vh]={!$showAlternative}>
		{$track?.artist || m.nothing_playing_subtitle()}
	</p>

	{#if $track}
		<div class="mx-auto w-1/2 max-xl:w-full" class:w-full={$showAlternative}>
			<div class="relative max-xl:mt-[4vh]" class:mt-[4vh]={$showAlternative}>
				<div class="mb-[1vh] flex justify-between">
					<span class="text-[2.2vh]">
						{formatDuration($track.progress_ms)}
					</span>
					<span class="text-[2.2vh]">
						{formatDuration($track.duration_ms)}
					</span>
				</div>
				<div class="h-[1vh] w-full rounded-full bg-gray-400">
					<div
						id="progress-bar"
						class="h-[1vh] rounded-full bg-white"
						style="width: {($track.progress_ms / $track.duration_ms) * 100}%"
					></div>
				</div>
			</div>
		</div>
	{/if}
</div>
