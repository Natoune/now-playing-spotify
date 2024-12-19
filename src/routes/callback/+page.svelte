<script lang="ts">
	import { getAccessToken } from '$lib/auth';
	import { redirect } from '$lib/location';
	import { isLoading } from '$lib/stores/loading';
	import { onMount } from 'svelte';

	$isLoading = true;

	onMount(async () => {
		const params = new URLSearchParams(location.search);
		const code = params.get('code');
		const errorParam = params.get('error');

		if (errorParam) {
			redirect(
				`/?error_toast=${errorParam === 'access_denied' ? 'auth_cancelled' : 'auth_failed'}`
			);
		}

		if (code) {
			try {
				await getAccessToken(code);
				redirect('/');
			} catch (err) {
				console.error('Error while getting access token:', err);
				redirect('/?error_toast=auth_failed');
			}
		}
	});
</script>
