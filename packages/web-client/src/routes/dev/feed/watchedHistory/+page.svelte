<script lang="ts">
import Button from '$components/button/Button.svelte';
import type { PostPopulated } from '$lib/helpers/feed';

let history: PostPopulated[] = [];

function getWatchedHistory() {}
</script>

<Button on:click="{getWatchedHistory}">Fetch history</Button>

{#if history.length}
	<pre>{history}</pre>
{/if}
