<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { Buffer } from 'buffer'; // @dfinity/agent requires this
import { browser } from '$app/env';
import { initializeAuthClient } from '$lib/authHelper';
import { auth } from '$stores/auth';
import Login from '$components/login/Login.svelte';

onMount(async () => {
	if (browser) {
		window.Buffer = Buffer;
		await initializeAuthClient();
	}
});
</script>

{#if $auth.showLogin}
	<Login />
{/if}

<slot />
