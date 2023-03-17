<script lang="ts">
import 'swiper/css'

import NoBetsIcon from '$components/icons/NoBetsIcon.svelte'
import HotOrNot from '$components/navigation/HotOrNot.svelte'
import HotOrNotPlayer from '$components/player/HotOrNotPlayer.svelte'
import { Swiper, SwiperSlide } from 'swiper/svelte'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import { individualUser } from '$lib/helpers/backend'
import {
  getHotOrNotPosts,
  getSinglePostById,
  type PostPopulated,
  type PostPopulatedHistory,
} from '$lib/helpers/feed'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import { isiPhone } from '$lib/utils/isSafari'
import Log from '$lib/utils/Log'
import { handleParams } from '$lib/utils/params'
import { hotOrNotFeedVideos, playerState } from '$stores/playerState'
import { hideSplashScreen } from '$stores/splashScreen'
import Button from '$components/button/Button.svelte'
import { beforeNavigate } from '$app/navigation'
import { page } from '$app/stores'
import { browser } from '$app/environment'
import type { IDB } from '$lib/idb'
import { tick, onMount, onDestroy } from 'svelte'
import { updateURL } from '$lib/utils/feedUrl'
import { updateMetadata } from '$lib/utils/video'

const fetchCount = 25
const fetchWhenVideosLeft = 10
const keepVideosLoadedCount: number = 4

let videos: PostPopulated[] = []
let currentVideoIndex = 0
let noMoreVideos = false
let loading = true
let videoPlayers: VideoPlayer[] = []
let fetchedVideosCount = 0
let isIPhone = isiPhone()
let isDocumentHidden = false
let idb: IDB | null = null

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

      videos = [...videos, ...res.posts]

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
  recordView(videos[currentVideoIndex])
  updateURL(videos[currentVideoIndex])
  updateMetadata(videos[currentVideoIndex])
}

async function recordView(post?: PostPopulated) {
  if (!post) return
  const postHistory: PostPopulatedHistory = {
    ...post,
    watched_at: Date.now(),
  }
  try {
    if (!idb) {
      idb = (await import('$lib/idb')).idb
    }
    await idb.set(
      'watch-hon',
      post.publisher_canister_id + '@' + post.post_id,
      postHistory,
    )
  } catch (e) {
    Log({ error: e, source: '1 recordView', type: 'idb' }, 'error')
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    isDocumentHidden = true
  } else {
    isDocumentHidden = false
  }
}

onMount(async () => {
  $playerState.initialized = false
  $playerState.muted = true
  if ($hotOrNotFeedVideos.length) {
    videos = $hotOrNotFeedVideos
    $hotOrNotFeedVideos = []
    updateURL()
  } else {
    const post = await getSinglePostById($page.params.id, true)
    if (post) {
      videos = [post, ...videos]
      updateURL()
    }
  }
  await tick()
  await fetchNextVideos()
  handleParams()
  if (browser) {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }
})

onDestroy(() => {
  if (browser) {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
  if (loadTimeout) {
    clearTimeout(loadTimeout)
  }
})

beforeNavigate(() => {
  videos.length > 2 && hotOrNotFeedVideos.set(videos.slice(currentVideoIndex))
  isDocumentHidden = true
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
  {#each videos as video, i (i)}
    <SwiperSlide
      class="flex h-full w-full snap-always items-center justify-center">
      {#if currentVideoIndex - 2 < i && currentVideoIndex + keepVideosLoadedCount > i}
        <HotOrNotPlayer
          {i}
          postId={video.id}
          displayName={video.created_by_display_name[0]}
          profileLink={video.created_by_unique_user_name[0] ??
            video.created_by_user_principal_id}
          description={video.description}
          createdById={video.created_by_user_principal_id}
          videoViews={Number(video.total_view_count)}
          publisherCanisterId={video.publisher_canister_id}
          userProfileSrc={video.created_by_profile_photo_url[0]}
          betStatus={video.hot_or_not_betting_status[0]}
          {individualUser}
          thumbnail={getThumbnailUrl(video.video_uid)}>
          <VideoPlayer
            bind:this={videoPlayers[i]}
            on:loaded={() => hideSplashScreen(500)}
            {i}
            playFormat="hls"
            isiPhone={isIPhone}
            inView={i == currentVideoIndex && !isDocumentHidden}
            uid={video.video_uid} />
        </HotOrNotPlayer>
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
    <SwiperSlide class="relative h-full w-full items-center justify-center">
      <div
        class="absolute flex h-full w-full flex-col items-center justify-center space-y-8 bg-black/50 px-8">
        <NoBetsIcon class="w-56" />
        <div class="text-center text-lg font-bold">
          There are no more videos to bet on
        </div>
        <div class="absolute inset-x-0 bottom-0 z-[-1] max-h-48">
          <HotOrNot postId={0n} />
        </div>
      </div>
    </SwiperSlide>
  {/if}
</Swiper>
