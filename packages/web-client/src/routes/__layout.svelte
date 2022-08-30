<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { Buffer } from 'buffer'; // @dfinity/agent requires this
import { browser } from '$app/env';
import { initializeAuthClient } from '$lib/authHelper';
import SplashScreen from '$components/layout/SplashScreen.svelte';
import { page } from '$app/stores';
import { auth } from '$stores/auth';
import Login from '$components/login/Login.svelte';
import transparentSrc from '$assets/transparent.png';

onMount(async () => {
	if (browser) {
		window.Buffer = Buffer;
		await initializeAuthClient();
	}
});
</script>

<SplashScreen showOnPath="{$page.url.pathname.includes('all')}" />

{#if $auth.showLogin}
	<Login />
{/if}

<img class="absolute z-[-1]" alt="Transparent" src="{transparentSrc}" />
<slot />
