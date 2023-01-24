<script lang="ts">
import Button from '$components/button/Button.svelte';
import type { PostPopulated } from '$lib/helpers/feed';

let history: PostPopulated[] = [];
let error = false;

async function getWatchedHistory() {
	try {
		const { watchHistoryIdb } = await import('$lib/utils/idb');
		const values = (await watchHistoryIdb.values()) as PostPopulated[];
		if (values.length) {
			history = values;
			console.log({ history });
		}
	} catch (_) {
		error = true;
		history = [];
	}
}
</script>

<Button on:click="{getWatchedHistory}">Fetch history</Button>

<div class="py-2 text-sm text-white">
	{#if error}
		Error fetching history
	{:else if history.length}
		<pre>{JSON.stringify(
				history,
				(_, val) => {
					if (typeof val === 'bigint') {
						return Number(val);
					} else return val;
				},
				2
			)}</pre>
	{/if}
</div>
