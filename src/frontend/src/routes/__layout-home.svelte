<script lang="ts">
import '../css/app.css';
import { Buffer } from 'buffer'; // @dfinity/agent requires this. Can be removed once it's fixed
import AuthStateLoader from '$components/auth/AuthStateLoader.svelte';
import IndefiniteLoader from '$components/loader/IndefiniteLoader.svelte';
import NavigationMenu from '$components/navigation/NavigationMenu.svelte';
import isProcessing from '$stores/loading/isProcessing';
import Transition from '$components/routing/Transition.svelte';
import { onMount } from 'svelte';
import { browser } from '$app/env';
import GoogleAnalytics, { registerEvent } from '$components/seo/GoogleAnalytics.svelte';

let isAuthStateLoaded = false;

onMount(async () => {
	if (browser) {
		window.Buffer = Buffer;
	}
});
</script>

<AuthStateLoader bind:isAuthStateLoaded />
{#if isAuthStateLoaded}
	<Transition>
		<slot />
	</Transition>
	<NavigationMenu />
	{#if $isProcessing}
		<IndefiniteLoader />
	{/if}
{/if}
<GoogleAnalytics />
