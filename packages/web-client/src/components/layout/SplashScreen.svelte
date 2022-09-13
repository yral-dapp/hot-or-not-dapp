<script lang="ts">
import { fade } from 'svelte/transition';
import { showSplashScreen } from '$stores/splashScreen';
import HotorNotIcon from '$components/icons/HotorNotIcon.svelte';

$: if ($showSplashScreen) {
	setTimeout(() => {
		$showSplashScreen = false;
	}, 2000);
}
</script>

{#if $showSplashScreen}
	<splash-screen
		out:fade|local="{{ duration: 500 }}"
		class="absolute z-[15] flex h-full w-full items-center justify-center bg-black">
		<HotorNotIcon class="h-56" />
	</splash-screen>
{/if}
