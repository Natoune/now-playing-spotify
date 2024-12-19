<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';

	import Loading from '$lib/components/loading.svelte';
	import * as m from '$lib/paraglide/messages';
	import { isLoading } from '$lib/stores/loading';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import '../app.css';
	const { children } = $props();

	onMount(async () => {
		const params = new URLSearchParams(location.search);
		const errorParam = params.get('error_toast');

		if (errorParam) {
			switch (errorParam) {
				case 'auth_failed':
					toast.error(m.error_auth_failed(), {
						position: 'bottom-right'
					});
					break;
				case 'auth_cancelled':
					toast.error(m.error_auth_cancelled(), {
						position: 'bottom-right'
					});
					break;
			}

			const url = new URL(location.href);
			url.searchParams.delete('error_toast');
			history.replaceState({}, document.title, url);
		}
	});
</script>

<ParaglideJS {i18n}>
	<Toaster />
	<div class="flex min-h-screen flex-col items-center justify-center bg-[#121212] text-white">
		{#if $isLoading}
			<Loading />
		{/if}
		{@render children()}
	</div>
</ParaglideJS>
