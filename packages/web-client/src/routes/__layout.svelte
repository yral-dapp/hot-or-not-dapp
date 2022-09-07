<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { Buffer } from 'buffer'; // @dfinity/agent requires this
import { browser } from '$app/env';
import { initializeAuthClient } from '$lib/authHelper';
import { auth } from '$stores/auth';
import Login from '$components/login/Login.svelte';
import LogRocket from 'logrocket';

onMount(async () => {
	if (browser) {
		window.Buffer = Buffer;
		await initializeAuthClient();
		LogRocket.init('8n3yhe/hotornot');
		LogRocket.identify(navigator.platform, { name: 'Tester' });
	}
});
</script>

{#if $auth.showLogin}
	<Login />
{/if}

<slot />
