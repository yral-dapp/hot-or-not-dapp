<script lang="ts">
import { beforeNavigate } from '$app/navigation'
import Button from '$components/button/Button.svelte'
import NoBetsIcon from '$components/icons/NoBetsIcon.svelte'
import PlayerLayout from '$components/layout/PlayerLayout.svelte'
import HotOrNotBet from '$components/hot-or-not/HotOrNotBet.svelte'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import {
  getHotOrNotPosts,
  updatePostInWatchHistory,
  type PostPopulated,
} from '$lib/helpers/feed'
import { updateURL } from '$lib/utils/feedUrl'
import Log from '$lib/utils/Log'
import { handleParams } from '$lib/utils/params'
import { joinArrayUniquely, updateMetadata } from '$lib/utils/video'
import { hotOrNotFeedVideos, playerState } from '$stores/playerState'
import { hideSplashScreen } from '$stores/splashScreen'
import Hls from 'hls.js/dist/hls.min'
import { onMount, tick } from 'svelte'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/svelte'
import HotOrNotRoomInfo from '$components/hot-or-not/HotOrNotRoomInfo.svelte'
import type { PageData } from './$types'

export let data: PageData

const fetchCount = 25
const fetchWhenVideosLeft = 10
const keepVideosLoadedCount: number = 4

let videos: PostPopulated[] = []
let currentVideoIndex = 0
let lastWatchedVideoIndex = -1
let noMoreVideos = false
let loading = false
let fetchedVideosCount = 0

let loadTimeout: ReturnType<typeof setTimeout> | undefined = undefined
let errorCount = 0
let showError = false

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
      Log(
        {
          res: 'fetching from ' + fetchedVideosCount,
          source: '0 fetchNextVideos',
        },
        'info',
      )
      loading = true
      const res = await getHotOrNotPosts(fetchedVideosCount, fetchCount)
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
        noMoreVideos = res.noMorePosts
      } else if (!res.noMorePosts && res.posts.length < fetchCount - 10) {
        fetchNextVideos(true)
      }

      await tick()
      loading = false

      Log({ res: 'fetched', noMoreVideos, source: '0 fetchNextVideos' }, 'info')
    } catch (e) {
      Log({ error: e, noMoreVideos, source: '1 fetchNextVideos' }, 'error')
      loading = false
    }
  }
}

async function handleChange(e: CustomEvent) {
  const index = e.detail[0].realIndex
  currentVideoIndex = index
  Log({ currentVideoIndex, source: '0 handleChange' }, 'info')
  fetchNextVideos()
  updatePostInWatchHistory('watch-hon', videos[currentVideoIndex])
  updateURL(videos[currentVideoIndex])
  updateMetadata(videos[currentVideoIndex])
}

onMount(async () => {
  updateURL()
  $playerState.initialized = false
  $playerState.muted = true
  if ($hotOrNotFeedVideos.length) {
    videos = $hotOrNotFeedVideos
    $hotOrNotFeedVideos = []
  } else if (data?.post) {
    videos = [data.post, ...videos]
    await updatePostInWatchHistory('watch-hon', data.post)
  }
  await tick()
  await fetchNextVideos()
  handleParams()
})

beforeNavigate(() => {
  videos.length > 2 && hotOrNotFeedVideos.set(videos.slice(currentVideoIndex))
})
</script>

<svelte:head>
  <title>Hot or Not Videos | Hot or Not</title>
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
          source="hon_feed"
          watchHistoryDb="watch-hon"
          showReferAndEarnLink
          showShareButton
          justWatched={i === lastWatchedVideoIndex}
          let:recordView>
          <VideoPlayer
            on:loaded={() => hideSplashScreen(500)}
            on:watchedPercentage={({ detail }) => recordView(detail)}
            index={i}
            playFormat="hls"
            {Hls}
            inView={i == currentVideoIndex && $playerState.visible}
            uid={post.video_uid} />
          <svelte:fragment slot="betRoomInfo">
            {#if post.hot_or_not_betting_status[0]}
              <HotOrNotRoomInfo
                bettingStatus={post.hot_or_not_betting_status[0]} />
            {/if}
          </svelte:fragment>
          <svelte:fragment slot="hotOrNot">
            <HotOrNotBet
              me
              {post}
              inView={i == currentVideoIndex && $playerState.visible} />
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
          href="/hotornot">
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
        <NoBetsIcon class="w-56" />
        <div class="text-center text-lg font-bold">
          There are no more videos to bet on
        </div>
        <div class="absolute inset-x-0 bottom-20 z-[-1] max-h-48">
          <HotOrNotBet disabled />
        </div>
      </div>
    </SwiperSlide>
  {/if}
</Swiper>
