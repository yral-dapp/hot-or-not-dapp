<script lang="ts">
import type { PostPopulatedHistory } from '$lib/helpers/feed'
import { onMount } from 'svelte'

let watchHistory: PostPopulatedHistory[] = []
let error = false

async function getHistory() {
  try {
    const { idb } = await import('$lib/idb')
    const values = (await idb.values('watch')) as PostPopulatedHistory[]
    if (values.length) {
      watchHistory = values
    }
  } catch (_) {
    error = true
    watchHistory = []
  }
}

onMount(() => getHistory())
</script>

<div class="py-2 text-sm text-white">
  {#if error}
    Error fetching history
  {:else if watchHistory.length}
    <table class="table-auto divide-y divide-white/30 border">
      <thead>
        <tr>
          <th>ID</th>
          <th>Uploaded by</th>
          <th>Watched at</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {#each watchHistory as item}
          <tr>
            <td>{item.id}</td>
            <td>
              {item.created_by_user_principal_id} ({item.created_by_display_name})
            </td>
            <td>{new Date(item.watched_at).toLocaleString()}</td>
            <td>{item.description}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
