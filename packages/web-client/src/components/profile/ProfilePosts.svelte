<script lang="ts">
import type { PostDetailsForFrontend } from '$canisters/individual_user_template/individual_user_template.did'
import Button from '$components/button/Button.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import NoPostsIcon from '$components/icons/NoPostsIcon.svelte'
import ReportIcon from '$components/icons/ReportIcon.svelte'
import IntersectionObserver from '$components/intersection-observer/IntersectionObserver.svelte'
import { fetchPosts } from '$lib/helpers/profile'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import Log from '$lib/utils/Log'
import { onMount } from 'svelte'
import ProfilePost from './ProfilePost.svelte'

export let me = false
export let userId = ''

let posts: PostDetailsForFrontend[] = []
let loading = true
let error = false
let noMorePosts = false
let fetchedCount = 0

async function loadPosts() {
  try {
    if (loading) {
      return
    }

    loading = true
    error = false
    const res = await fetchPosts(userId, fetchedCount)

    if (res.error) {
      error = true
      loading = false
      return
    }

    posts.push(...res.posts)
    noMorePosts = res.noMorePosts
    fetchedCount = posts.length
    loading = false
    posts = posts
  } catch (e) {
    error = true
    loading = false
    Log({ error: e, from: '1 loadPosts' }, 'error')
  }
}

onMount(() => loadPosts())
</script>

{#if posts.length}
  <div class="grid grid-cols-3 gap-3 md:grid-cols-4 xl:grid-cols-5">
    {#each posts as post}
      <ProfilePost
        id={Number(post.id)}
        views={Number(post.total_view_count)}
        likes={Number(post.like_count)}
        imageBg={getThumbnailUrl(post.video_uid)} />
    {/each}
  </div>
{:else if !loading && !error}
  <div
    class="flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
    <NoPostsIcon class="w-52" />
    <div class="text-center text-lg font-bold">
      {#if me}
        You have not uploaded any videos yet
      {:else}
        This user has not uploaded any videos yet
      {/if}
    </div>
    {#if me}
      <Button href="/upload" preload class="w-full">
        Upload your first video
      </Button>
    {/if}
  </div>
{/if}
{#if error}
  <div class="flex w-full flex-col items-center justify-center space-y-2 py-8">
    <div class="flex items-center space-x-2 text-sm text-red-500">
      <ReportIcon class="h-4 w-4" />
      <span>Error while fetching posts</span>
    </div>
    <Button on:click={loadPosts} type="secondary" class="px-6 py-2 text-xs">
      Try again
    </Button>
  </div>
{:else if loading}
  <div class="flex w-full items-center justify-center space-x-2 py-8">
    <LoadingIcon class="h-4 w-4 animate-spin" />
    <span>Fetching posts</span>
  </div>
{/if}
{#if noMorePosts && posts.length}
  <div
    class="flex w-full items-center justify-center space-x-2 py-8 opacity-40">
    <span>No more posts</span>
  </div>
{/if}

<IntersectionObserver
  on:intersected={loadPosts}
  threshold={0.1}
  disabled={loading || error}
  intersect={!noMorePosts}>
  <svelte:fragment>
    <div class="h-4 w-full" />
  </svelte:fragment>
</IntersectionObserver>
