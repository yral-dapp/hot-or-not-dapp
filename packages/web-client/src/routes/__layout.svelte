<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { Buffer } from 'buffer'; // @dfinity/agent requires this
import { browser } from '$app/env';
import { initializeAuthClient } from '$lib/helpers/auth';
import { auth } from '$stores/auth';
import Login from '$components/login/Login.svelte';
import Log from '$lib/utils/Log';

onMount(async () => {
	if (browser) {
		try {
			window.Buffer = Buffer;
			await initializeAuthClient();
		} catch (e) {
			Log({ error: e, source: '0 layout' }, 'error');
		}
	}
});
</script>

{#if $auth.showLogin}
	<Login />
{/if}

<slot />
