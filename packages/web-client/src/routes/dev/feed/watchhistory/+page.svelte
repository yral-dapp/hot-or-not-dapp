<script lang="ts">
import type { PostPopulatedHistory } from '$lib/helpers/feed';
import { onMount } from 'svelte';

let history: PostPopulatedHistory[] = [];
let error = false;

async function getHistory() {
	try {
		const { watchHistoryIdb } = await import('$lib/utils/idb');
		const values = (await watchHistoryIdb.values()) as PostPopulatedHistory[];
		if (values.length) {
			history = values;
			console.log({ history });
		}
	} catch (_) {
		error = true;
		history = [];
	}
}

onMount(() => getHistory());
</script>

<div class="py-2 text-sm text-white">
	{#if error}
		Error fetching history
	{:else if history.length}
		<table class="table-auto border divide-y divide-white/30">
			<thead>
				<tr>
					<th>ID</th>
					<th>Uploaded by</th>
					<th>Watched at</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{#each history as item}
					<tr>
						<td>{item.id}</td>
						<td>{item.created_by_user_principal_id} ({item.created_by_display_name})</td>
						<td>{new Date(item.watched_at).toLocaleString()}</td>
						<td>{item.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
