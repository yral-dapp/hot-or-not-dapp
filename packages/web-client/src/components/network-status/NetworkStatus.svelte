<script lang="ts">
export let offline = false;
</script>

<svelte:window on:offline="{() => (offline = true)}" on:online="{() => (offline = false)}" />

{#if offline}
	<network-status class="h-3 text-xs">
		Offline. Please check your internet connection.
	</network-status>
{/if}
