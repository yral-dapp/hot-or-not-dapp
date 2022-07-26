<script lang="ts">
import IndefiniteLoader from '$components/loader/IndefiniteLoader.svelte';
export let component: any;
</script>

{#await component.then ? component : component()}
	<IndefiniteLoader />
{:then Cmp}
	<svelte:component this="{Cmp.default}" />
{/await}
