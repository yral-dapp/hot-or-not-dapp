<script lang="ts">
import { fade } from 'svelte/transition';
import { onMount } from 'svelte';
import { showSplashScreen } from '$stores/splashScreen';

onMount(() =>
	setTimeout(() => {
		$showSplashScreen = false;
	}, 3000)
);
</script>

{#if $showSplashScreen}
	<splash-screen
		out:fade|local="{{ duration: 500 }}"
		class="absolute z-[15] flex h-full w-full items-center justify-center bg-primary text-9xl"
	>
		H.o.N
	</splash-screen>
{/if}
