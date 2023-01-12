<script lang="ts">
import { slide } from 'svelte/transition';

export let offline = false;
</script>

<svelte:window on:offline="{() => (offline = true)}" on:online="{() => (offline = false)}" />

{#if offline}
	<network-status
		transition:slide|local="{{ delay: 500 }}"
		class="h-3 text-xs {offline ? 'bg-red-500' : 'bg-green-500'}">
		Offline. Please check your internet connection.
	</network-status>
{/if}
