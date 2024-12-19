<script lang="ts">
	import FullscreenOff from '$lib/components/svg/fullscreen-off.svelte';
	import FullscreenOn from '$lib/components/svg/fullscreen-on.svelte';
	import Logout from '$lib/components/svg/logout.svelte';
	import Lyrics from '$lib/components/svg/lyrics.svelte';
	import { redirect } from '$lib/location';
	import * as m from '$lib/paraglide/messages.js';
	import { showAlternative } from '$lib/stores/alternative';
	import { showLyrics } from '$lib/stores/lyrics';
	import { track } from '$lib/stores/track';
	import toast from 'svelte-french-toast';
	import Alternative from './svg/alternative.svelte';

	let fullscreen = false;

	function toggleLyrics() {
		$showLyrics = !$showLyrics;
	}

	function disabledLyrics() {
		toast.error(m.lyrics_disabled());
	}

	function toggleAlternative() {
		$showAlternative = !$showAlternative;
	}

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen();
			fullscreen = true;
		} else {
			document.exitFullscreen();
			fullscreen = false;
		}
	}

	function logout() {
		redirect('/logout');
	}
</script>

<div
	class="fixed left-0 right-0 top-0 z-50 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"
>
	<div class="mr-[1%] flex items-center justify-end space-x-[2%] p-[1%]">
		<button onclick={toggleAlternative} class="flex items-center gap-2 rounded max-xl:hidden">
			<Alternative className="w-[3vw] h-[3vh]" />
			<span class="sr-only">{m.toolbar_alternative()}</span>
		</button>
		<button
			onclick={toggleLyrics}
			class="flex items-center gap-2 rounded disabled:opacity-50 max-xl:hidden"
			disabled={!$track?.lyrics && !$showLyrics}
		>
			<Lyrics className="w-[3vw] h-[3vh]" />
			<span class="sr-only">{m.toolbar_lyrics()}</span>
		</button>
		<button
			onclick={disabledLyrics}
			class="flex items-center gap-2 rounded disabled:opacity-50 xl:hidden"
			disabled={!$track?.lyrics && !$showLyrics}
		>
			<Lyrics className="w-[3vw] h-[3vh]" />
			<span class="sr-only">{m.toolbar_lyrics()}</span>
		</button>
		<button onclick={toggleFullscreen} class="flex items-center gap-2 rounded">
			{#if fullscreen}
				<FullscreenOn className="w-[3vw] h-[3vh]" />
			{:else}
				<FullscreenOff className="w-[3vw] h-[3vh]" />
			{/if}
			<span class="sr-only">{m.toolbar_fullscreen()}</span>
		</button>
		<button onclick={logout} class="flex items-center gap-2 rounded">
			<Logout className="w-[3vw] h-[3vh]" />
			<span class="sr-only">{m.toolbar_logout()}</span>
		</button>
	</div>
</div>
