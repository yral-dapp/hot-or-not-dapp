<script lang="ts">
import { fade } from 'svelte/transition';
import { showSplashScreen } from '$stores/splashScreen';
import FireIcon from '$components/icons/FireIcon.svelte';

$: if ($showSplashScreen) {
	setTimeout(() => {
		$showSplashScreen = false;
	}, 2000);
}
</script>

{#if $showSplashScreen}
	<splash-screen
		out:fade|local="{{ duration: 500 }}"
		class="absolute z-[15] flex h-full w-full items-center justify-center bg-primary text-9xl"
	>
		<FireIcon class="h-36 w-36" />
	</splash-screen>
{/if}
