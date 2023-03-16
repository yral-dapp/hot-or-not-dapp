<script lang="ts">
import { getTopPosts, type PostPopulated } from '$lib/helpers/feed'
import { joinArrayUniquely } from '$lib/utils/video'
import { onMount } from 'svelte'
import { tick } from 'svelte'

let videos: PostPopulated[] = []
let error = false
let fromCount = 0

async function getVideosForFeed() {
  try {
    const res = await getTopPosts(fromCount, 50, true)
    if (res.error) {
      error = true
      return
    }
    fromCount = res.from

    videos = joinArrayUniquely(videos, res.posts)

    await tick()

    if (res.noMorePosts) {
      return
    } else if (videos.length < 90) {
      getVideosForFeed()
    }
  } catch (_) {
    error = true
    videos = []
  }
}

onMount(() => getVideosForFeed())
</script>

<div class="py-2 text-sm text-white">
  {#if error}
    Error fetching history
  {:else if videos.length}
    <table class="table-auto divide-y divide-white/30 border">
      <thead>
        <tr>
          <th>SN</th>
          <th>Uploaded by</th>
          <th>VIDEO_ID</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {#each videos as item, i}
          <tr>
            <td>{i + 1}</td>
            <td>
              {item.created_by_user_principal_id} ({item.created_by_display_name})
            </td>
            <td>{item.id}</td>
            <td>{item.description}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
