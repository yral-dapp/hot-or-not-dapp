<script lang="ts">
import { beforeNavigate } from '$app/navigation'
import Button from '$components/button/Button.svelte'
import PlayerLayout from '$components/layout/PlayerLayout.svelte'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import { updateURL } from '$lib/utils/feedUrl'
import { joinArrayUniquely } from '$lib/utils/video'
import { playerState } from '$stores/playerState'
import { hideSplashScreen } from '$stores/popups'
import Hls from 'hls.js/dist/hls.min.js'
import { onMount, tick } from 'svelte'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/svelte'
import Icon from '$components/icon/Icon.svelte'
import UpDownVote from '$components/up-down/UpDownVote.svelte'
import UpDownVoteControls from '$components/up-down/UpDownVoteControls.svelte'
import type { UpDownPost } from '$lib/db/db.types'
import { getVideos } from '$lib/helpers/feed'

const fetchWhenVideosLeft = 5
const keepVideosLoadedCount: number = 3

let videos: UpDownPost[] = []
let currentVideoIndex = 0
let lastWatchedVideoIndex = -1
let noMoreVideos = false
let loading = false

let loadTimeout: ReturnType<typeof setTimeout> | undefined = undefined
let errorCount = 0
let showError = false

async function fetchNextVideos() {
  console.log('called fetchNextVideos')
  if (noMoreVideos) {
    console.log('No more videos to load')
    return
  }

  if (videos.length - currentVideoIndex > fetchWhenVideosLeft) {
    return
  }

  loading = true
  const res = await getVideos()
  console.log({ res })
  if (!res.ok || !res.videos) {
    return
  }

  videos = joinArrayUniquely(videos, res.videos)
  noMoreVideos = !res.more
  loading = false
}

async function handleChange(e: CustomEvent) {
  lastWatchedVideoIndex = currentVideoIndex
  const newIndex = e.detail[0].realIndex
  currentVideoIndex = newIndex
  fetchNextVideos()
  updateURL(videos[currentVideoIndex])
}

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

<Swiper
  direction={'vertical'}
  observer
  cssMode
  slidesPerView={1}
  on:slideChange={handleChange}
  spaceBetween={300}
  class="h-full w-full">
  {#each videos as post, i (i)}
    <SwiperSlide
      class="flex h-full w-full snap-always items-center justify-center">
      {#if currentVideoIndex - 2 < i && currentVideoIndex + keepVideosLoadedCount > i}
        <PlayerLayout
          bind:post
          index={i}
          source="ud-feed"
          showLikeButton
          showDislikeButton
          showTimer
          showShareButton
          let:recordView
          let:updateStats>
          <VideoPlayer
            on:watchComplete={updateStats}
            on:loaded={() => hideSplashScreen(500)}
            on:watchedPercentage={({ detail }) => recordView(detail)}
            on:videoUnavailable={() => handleUnavailableVideo(i)}
            index={i}
            playFormat="hls"
            {Hls}
            inView={i == currentVideoIndex && $playerState.visible}
            uid={post.video_uid} />

          <svelte:fragment slot="controls">
            <UpDownVote {post} />
          </svelte:fragment>
        </PlayerLayout>
      {/if}
    </SwiperSlide>
  {/each}
  {#if showError}
    <SwiperSlide class="flex h-full w-full items-center justify-center">
      <div
        class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
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
    </SwiperSlide>
  {/if}
  {#if loading}
    <SwiperSlide class="flex h-full w-full items-center justify-center">
      <div
        class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
        <div class="text-center text-lg font-bold">Loading</div>
      </div>
    </SwiperSlide>
  {/if}
  {#if noMoreVideos}
    <SwiperSlide class="relative h-full w-full items-center justify-center">
      <div
        class="absolute flex h-full w-full flex-col items-center justify-center space-y-8 bg-black/50 px-8">
        <Icon name="votes-graphics" class="w-56" />
        <div class="text-center text-lg font-bold">
          There are no more videos to vote on
        </div>
        <div class="absolute inset-x-0 bottom-20 z-[-1] max-h-48">
          <UpDownVoteControls disabled score={100} />
        </div>
      </div>
    </SwiperSlide>
  {/if}
</Swiper>
