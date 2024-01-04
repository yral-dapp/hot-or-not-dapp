<script lang="ts">
import PlayerLayout from '$lib/components/layout/PlayerLayout.svelte'
import VideoPlayer from '$lib/components/video/VideoPlayer.svelte'
import PlayerRenderer from '@hnn/components/video/PlayerRenderer.svelte'
import Button from '@hnn/components/button/Button.svelte'
import { beforeNavigate } from '$app/navigation'
import { updateURL } from '$lib/utils/feedUrl'
import { joinArrayUniquely } from '$lib/utils/video'
import { playerState } from '$lib/stores/playerState'
import { onMount } from 'svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import UpDownVote from '$lib/components/vote/UpDownVote.svelte'
import UpDownVoteControls from '$lib/components/vote/UpDownVoteControls.svelte'
import type { UpDownPost } from '$lib/db/db.types'
import { getVideos } from '$lib/db/feed'
import type { QueryDocumentSnapshot } from 'firebase/firestore'
import { debounce } from 'throttle-debounce'
import { removeSplashScreen } from '$lib/stores/popups'
import { page } from '$app/stores'
import { browser } from '$app/environment'

const fetchWhenVideosLeft = 5
const keepVideosLoadedCount: number = 4

let videos: UpDownPost[] = []
let currentVideoIndex = 0
let noMoreVideos = false
let loading = false
let first = true
let lastLoadedVideoRef: QueryDocumentSnapshot | undefined = undefined

let showError = false

async function fetchNextVideos() {
  console.log('f1')
  if (noMoreVideos) {
    console.log('r1')
    return
  }

  if (videos.length - currentVideoIndex > fetchWhenVideosLeft) {
    return
  }

  console.log('f2')

  loading = true

  const res = await getVideos(
    lastLoadedVideoRef,
    first ? $page.params.id : undefined,
  )
  if (!res.ok || !res.videos) {
    console.log('r2')
    return
  }

  videos = joinArrayUniquely(videos, res.videos)
  lastLoadedVideoRef = res.lastRef

  if (!videos.length) {
    noMoreVideos = true
  } else {
    noMoreVideos = !res.more
  }

  loading = false
}

const handleChange = debounce(250, (newIndex: number) => {
  currentVideoIndex = newIndex
  fetchNextVideos()
  updateURL(videos[currentVideoIndex])
})

async function handleUnavailableVideo(index: number) {
  videos.splice(index, 1)
  videos = videos
}

onMount(async () => {
  updateURL()
  $playerState.initialized = false
  $playerState.muted = true
  $playerState.visible = true
  fetchNextVideos()
})

beforeNavigate(() => {
  $playerState.visible = false
  $playerState.muted = true
})
</script>

<svelte:head>
  <title>Up Down | Hot or Not</title>
</svelte:head>

<div
  style="height: 100dvh;"
  class="hide-scrollbar relative flex w-full snap-y snap-mandatory flex-col overflow-hidden overflow-y-auto">
  {#each videos as post, index (post.id)}
    <PlayerRenderer
      {browser}
      {keepVideosLoadedCount}
      {index}
      activeIndex={currentVideoIndex}
      let:show>
      <PlayerLayout
        bind:post
        {index}
        {show}
        showLikeButton
        showDislikeButton
        showTimer
        showShareButton
        let:recordView
        on:view={({ detail }) => handleChange(detail)}
        let:updateStats>
        <VideoPlayer
          on:watchComplete={updateStats}
          on:loaded={() => removeSplashScreen()}
          on:watchedPercentage={({ detail }) => recordView(detail)}
          on:videoUnavailable={() => handleUnavailableVideo(index)}
          {index}
          playFormat="hls"
          inView={index == currentVideoIndex && $playerState.visible}
          uid={post.video_uid} />
        <svelte:fragment slot="controls">
          <UpDownVote {post} />
        </svelte:fragment>
      </PlayerLayout>
    </PlayerRenderer>
  {/each}
  {#if showError}
    <div
      class="relative flex h-screen w-full shrink-0 snap-center snap-always flex-col items-center justify-center space-y-8 px-8">
      <div class="text-center text-lg font-bold">
        Error loading posts. Please, refresh the page.
      </div>
      <Button
        type="primary"
        on:click={(e) => e.preventDefault()}
        href="/up-down">
        Clear here to refresh
      </Button>
    </div>
  {/if}
  {#if loading}
    <div
      class="relative flex h-screen w-full shrink-0 snap-center snap-always flex-col items-center justify-center space-y-8 px-8">
      <div class="text-center text-lg font-bold">Loading</div>
    </div>
  {/if}
  {#if noMoreVideos}
    <div
      class="relative flex h-screen w-full shrink-0 snap-center snap-always flex-col items-center justify-center space-y-8 px-8">
      <Icon name="votes-graphics" class="w-56" />
      <div class="text-center text-lg font-bold">
        There are no more videos to vote on
      </div>
      <div class="absolute inset-x-0 bottom-20 z-[-1] max-h-48">
        <UpDownVoteControls disabled score={100} />
      </div>
    </div>
  {/if}
</div>
