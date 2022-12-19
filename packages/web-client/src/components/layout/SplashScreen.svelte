<script lang="ts">
import { fade } from 'svelte/transition';
import { hideSplashScreen, showSplashScreen } from '$stores/splashScreen';
import HotorNotIcon from '$components/icons/HotorNotIcon.svelte';
import LoadingIcon from '$components/icons/LoadingIcon.svelte';
import { onMount } from 'svelte';

onMount(() => {
	hideSplashScreen(5000);
});
</script>

{#if $showSplashScreen}
	<splash-screen
		out:fade|local="{{ duration: 500 }}"
		class="spacy-y-8 absolute z-[15] flex h-full w-full flex-col items-center justify-center space-y-10 bg-black">
		<HotorNotIcon class="h-56" />
		<LoadingIcon class="h-5 w-5 animate-spin-slow opacity-50" />
	</splash-screen>
{/if}
