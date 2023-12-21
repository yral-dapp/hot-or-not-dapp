<script lang="ts">
import { beforeNavigate } from '$app/navigation'
import { page } from '$app/stores'
import Button from '$components/button/Button.svelte'
import PlayerLayout from '$components/layout/PlayerLayout.svelte'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import {
  getTopPosts,
  getWatchedVideosFromCache,
  updatePostInWatchHistory,
  type PostPopulated,
} from '$lib/helpers/feed'
import { updateURL } from '$lib/utils/feedUrl'
import Log from '$lib/utils/Log'
import { handleParams } from '$lib/utils/params'
import { joinArrayUniquely, updateMetadata } from '$lib/utils/video'
import { homeFeedVideos, playerState } from '$stores/playerState'
import { hideSplashScreen } from '$stores/popups'
import Hls from 'hls.js/dist/hls.min.js'
import { onMount, tick } from 'svelte'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/svelte'
import type { PageData } from './$types'
import Icon from '$components/icon/Icon.svelte'

export let data: PageData

const fetchCount = 25
const fetchWhenVideosLeft = 10
const keepVideosLoadedCount: number = 3

let videos: PostPopulated[] = []
let currentVideoIndex = 0
let noMoreVideos = false
let loading = false
let fetchedVideosCount = 0

let loadTimeout: ReturnType<typeof setTimeout> | undefined = undefined
let errorCount = 0
let showError = false

$: pathname = $page.url.pathname

async function fetchNextVideos(force = false) {
  // console.log(
  // 	`to fetch: ${!noMoreVideos} && ${
  // 		videos.length
  // 	} - ${currentVideoIndex}<${fetchCount}, errorCount: ${errorCount}`
  // );
  if (
    !noMoreVideos &&
    (force || videos.length - currentVideoIndex < fetchWhenVideosLeft)
  ) {
    try {
      Log('info', 'Fetching videos for feed', {
        res: 'fetching from ' + fetchedVideosCount,
        source: 'feed.fetchNextVideos',
      })
      loading = true
      const res = await getTopPosts(fetchedVideosCount, fetchCount, true)
      if (res.error) {
        if (errorCount < 4) {
          loadTimeout = setTimeout(() => {
            errorCount++
            fetchNextVideos()
          }, 5000)
        } else {
          clearTimeout(loadTimeout)
          showError = true
          loading = false
        }
        return
      } else {
        errorCount = 0
        if (loadTimeout) clearTimeout(loadTimeout)
      }

      fetchedVideosCount = res.from

      videos = joinArrayUniquely(videos, res.posts)

      if (res.noMorePosts) {
        const watchedVideos = await getWatchedVideosFromCache('watch')
        videos = joinArrayUniquely(videos, watchedVideos)
      } else if (res.posts.length < fetchCount - 10) {
        fetchNextVideos(true)
      }

      noMoreVideos = res.noMorePosts
      await tick()
      loading = false
      Log('info', 'Fetched videos for feed', {
        noMoreVideos,
        source: 'feed.fetchNextVideos',
      })
    } catch (e) {
      Log('warn', 'Could not fetch videos for feed', {
        error: e,
        noMoreVideos,
        source: 'feed.fetchNextVideos',
      })
      loading = false
    }
  }
}

async function handleUnavailableVideo(index: number) {
  videos.splice(index, 1)
  videos = videos
}

async function handleChange(e: CustomEvent) {
  const newIndex = e.detail[0].realIndex
  currentVideoIndex = newIndex
  fetchNextVideos()
  updateURL(videos[currentVideoIndex])
  updateMetadata(videos[currentVideoIndex])
}

onMount(async () => {
  updateURL()
  $playerState.initialized = false
  $playerState.muted = true
  $playerState.visible = true
  if ($homeFeedVideos.length) {
    videos = $homeFeedVideos
    $homeFeedVideos = []
  } else if (data.post) {
    videos = [data.post, ...videos]
    await updatePostInWatchHistory('watch', data.post)
  }
  await tick()
  await fetchNextVideos()
  handleParams()
})

beforeNavigate(() => {
  $playerState.visible = false
  $playerState.muted = true
  if (loadTimeout) {
    clearTimeout(loadTimeout)
  }
})
</script>

<svelte:head>
  <title>Home Feed | Hot or Not</title>
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
          source="main_feed"
          watchHistoryDb="watch"
          showReportButton
          showLikeButton
          showReferAndEarnLink
          showShareButton
          showDescription
          showHotOrNotButton
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
        <Button type="primary" on:click={(e) => e.preventDefault()} href="/">
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
    <SwiperSlide class="flex h-full w-full items-center justify-center">
      <div
        class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
        <Icon name="videos-graphic" class="w-56" />
        <div class="text-center text-lg font-bold">
          No more videos to display today
        </div>
      </div>
    </SwiperSlide>
  {/if}
</Swiper>
