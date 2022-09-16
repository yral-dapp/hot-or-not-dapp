<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { Buffer } from 'buffer'; // @dfinity/agent requires this
import { browser } from '$app/environment';
import { initializeAuthClient } from '$lib/helpers/auth';
import { authStore } from '$stores/auth';
import Login from '$components/login/Login.svelte';
import Log from '$lib/utils/Log';

onMount(async () => {
	if (browser) {
		try {
			window.Buffer = Buffer;
			if (process.env.NODE_ENV != 'development') {
				(window as any).LogRocket && (window as any).LogRocket.init('c77ths/hotornot');
				Log('LR Initialized', 'info');
			}
			await initializeAuthClient();
		} catch (e) {
			Log({ error: e, source: '0 layout' }, 'error');
		}
	}
});
</script>

{#if $authStore.showLogin}
	<Login />
{/if}

<slot />
