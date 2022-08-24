<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { Buffer } from 'buffer'; // @dfinity/agent requires this
import { browser } from '$app/env';
import { initializeAuthClient } from '$lib/authHelper';
import SplashScreen from '$components/layout/SplashScreen.svelte';
import { page } from '$app/stores';
import { showSplashScreen } from '$stores/splashScreen';
import { auth } from '$stores/auth';
import Login from '$components/login/Login.svelte';

onMount(async () => {
	if (browser) window.Buffer = Buffer;
	await initializeAuthClient();
});
</script>

{#if $showSplashScreen}
	<SplashScreen showOnPath="{$page.url.pathname.includes('all')}" />
{/if}
{#if $auth.showLogin}
	<Login />
{/if}
<div class="h-full w-full bg-black">
	<slot />
</div>
