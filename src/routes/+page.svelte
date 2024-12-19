<script lang="ts">
	import { ensureAccessToken, redirectToSpotify } from '$lib/auth';
	import Background from '$lib/components/background.svelte';
	import Lyrics from '$lib/components/lyrics.svelte';
	import Spotify from '$lib/components/svg/spotify.svelte';
	import Toolbar from '$lib/components/toolbar.svelte';
	import Track from '$lib/components/track.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { isLoading } from '$lib/stores/loading';
	import { showLyrics } from '$lib/stores/lyrics';
	import { track } from '$lib/stores/track';
	import { newTrack } from '$lib/track';
	import { onDestroy, onMount } from 'svelte';

	let isAuthenticated = $state(false);
	let progressInterval: number | null = null;
	let background: Background | null = $state(null);

	$isLoading = true;

	async function update() {
		if (await newTrack()) {
			background?.updateGradient($track?.palette || undefined);
		}
	}

	onMount(async () => {
		try {
			isAuthenticated = !!(await ensureAccessToken());
		} catch (error) {
			console.error('Error while checking authentication:', error);
			isAuthenticated = false;
		} finally {
			if (isAuthenticated) {
				// @ts-ignore
				progressInterval = setInterval(() => {
					if ($track?.is_playing) {
						$track.progress_ms = Math.min($track.progress_ms + 100, $track.duration_ms);
						if ($track.progress_ms >= $track.duration_ms) {
							$track.progress_ms = $track.duration_ms;
							update();
						}
					}
				}, 100);

				setInterval(async () => update(), 5000);

				await update();
			}

			$isLoading = false;
		}
	});

	onDestroy(() => {
		if (progressInterval) {
			clearInterval(progressInterval);
		}
	});
</script>

{#if isAuthenticated}
	<Background bind:this={background} />
	<Toolbar />

	<div class="flex w-full flex-row items-center justify-start space-x-10 px-[5vw]">
		<Track />
		{#if $showLyrics}
			<Lyrics />
		{/if}
	</div>
{:else}
	<div class="text-center">
		<h1 class="my-[1vh] font-title text-[4vh] font-bold">{m.title()}</h1>
		<p class="my-[1vh] text-[3vh]">{m.subtitle()}</p>
		<button
			onclick={redirectToSpotify}
			class="relative mx-auto mt-[5vh] flex items-center justify-center gap-4 rounded bg-[#1ED760] px-6 py-3 text-[3vh] font-semibold shadow-md transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
		>
			<Spotify className="2xl:hidden" />
			<span>{m.login()}</span>
		</button>
	</div>
{/if}
