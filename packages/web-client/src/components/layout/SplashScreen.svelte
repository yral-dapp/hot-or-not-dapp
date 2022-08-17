<script lang="ts">
import { fade } from 'svelte/transition';
import { onMount } from 'svelte';

export let showSplash = true;

onMount(() => setTimeout(() => (showSplash = false), 3000));
</script>

{#if showSplash}
	<splash-screen
		out:fade|local="{{ duration: 500 }}"
		class="absolute z-[15] flex h-full w-full items-center justify-center bg-primary text-9xl"
	>
		H.o.N
	</splash-screen>
{/if}
