<script lang="ts">
	import { logout } from '$lib/auth';
	import { redirect } from '$lib/location';
	import { isLoading } from '$lib/stores/loading';
	import { onMount } from 'svelte';

	$isLoading = true;

	onMount(async () => {
		await logout();
		redirect('/');
	});
</script>
