<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { Buffer } from 'buffer'; // @dfinity/agent requires this
import { browser } from '$app/env';
import { initializeAuthClient } from '$lib/authHelper';
import SplashScreen from '$components/layout/SplashScreen.svelte';
import { page } from '$app/stores';

onMount(async () => {
	if (browser) window.Buffer = Buffer;
	await initializeAuthClient();
});
</script>

<SplashScreen showOnPath="{$page.url.pathname.includes('all')}" />
<slot />
