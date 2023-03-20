<script lang="ts">
import { beforeNavigate } from '$app/navigation'
import { page } from '$app/stores'
import Button from '$components/button/Button.svelte'
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte'
import HomeFeedPlayer from '$components/player/HomeFeedPlayer.svelte'
import { registerEvent } from '$components/seo/GA.svelte'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import { individualUser } from '$lib/helpers/backend'
import {
  getTopPosts,
  getWatchedVideosFromCache,
  updatePostInWatchHistory,
  type PostPopulated,
} from '$lib/helpers/feed'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import { updateURL } from '$lib/utils/feedUrl'
import { isiPhone } from '$lib/utils/isSafari'
import Log from '$lib/utils/Log'
import { handleParams } from '$lib/utils/params'
import {
  joinArrayUniquely,
  updateMetadata,
  type VideoViewReport,
} from '$lib/utils/video'
import { homeFeedVideos, playerState } from '$stores/playerState'
import { hideSplashScreen } from '$stores/splashScreen'
import userProfile from '$stores/userProfile'
import { Principal } from '@dfinity/principal'
import Hls from 'hls.js/dist/hls.min'
import { onDestroy, onMount, tick } from 'svelte'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/svelte'
import type { PageData } from './$types'

export let data: PageData

const fetchCount = 25
const fetchWhenVideosLeft = 10
const keepVideosLoadedCount: number = 3

let videos: PostPopulated[] = []
let videoPlayers: VideoPlayer[] = []
let currentVideoIndex = 0
let noMoreVideos = false
let loading = false
let currentPlayingIndex = 0
let fetchedVideosCount = 0
let isIPhone = isiPhone()
let isDocumentHidden = false
let videoStats: Record<string, VideoViewReport> = {}

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
      Log(
        {
          res: 'fetching from ' + fetchedVideosCount,
          source: '0 fetchNextVideos',
        },
        'info',
      )
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
        const watchedVideos = await getWatchedVideosFromCache()
        videos = joinArrayUniquely(videos, watchedVideos)
      } else if (res.posts.length < fetchCount - 10) {
        fetchNextVideos(true)
      }

      noMoreVideos = res.noMorePosts
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
  const newIndex = e.detail[0].realIndex
  currentVideoIndex = newIndex
  Log({ currentVideoIndex, source: '0 handleChange' }, 'info')
  const lastVideo = videos[currentPlayingIndex]
  lastVideo?.publisher_canister_id &&
    updateStats(lastVideo.publisher_canister_id, Number(lastVideo.post_id))
  fetchNextVideos()
  updateURL(videos[currentVideoIndex])
  updateMetadata(videos[currentVideoIndex])
  currentPlayingIndex = newIndex
}

function handleVisibilityChange() {
  if (document.visibilityState === 'hidden') {
    isDocumentHidden = true
  } else {
    isDocumentHidden = false
  }
}

async function updateStats(canisterId: string, videoId: number) {
  const stats = videoStats[`${canisterId}@${videoId}`] as
    | VideoViewReport
    | undefined

  if (!stats || (stats?.count === 0 && stats?.progress === 0)) {
    return
  }

  delete videoStats[`${canisterId}@${videoId}`]

  if ($page.url.host.includes('t:')) return

  const payload =
    stats.count == 0
      ? {
          WatchedPartially: {
            percentage_watched: Math.ceil(stats.progress) || 1,
          },
        }
      : {
          WatchedMultipleTimes: {
            percentage_watched: Math.ceil(stats.progress) || 1,
            watch_count: stats.count,
          },
        }

  Log({ from: '0 updateStats', id: stats.videoId, payload }, 'info')

  registerEvent('view_video', {
    userId: $userProfile.principal_id,
    video_publisher_id: stats.profileId,
    video_publisher_canister_id: stats.canisterId,
    video_id: stats.videoId,
    watch_count: Math.ceil(stats.count + stats.progress),
    home_feed_score: stats.score,
  })
  await individualUser(
    Principal.from(stats.canisterId),
  ).update_post_add_view_details(stats.videoId, payload)
}

function recordStats(
  progress: number,
  canisterId: string,
  videoId: bigint,
  profileId: string,
  score: bigint,
) {
  const id = `${canisterId}@${videoId}`
  if (videoStats[id]) {
    videoStats[id].progress = progress
    if (progress == 0) {
      videoStats[id].count++

      if (videos[currentPlayingIndex]) {
        videos[currentPlayingIndex].total_view_count =
          videos[currentPlayingIndex].total_view_count + BigInt(1)
        updatePostInWatchHistory('watch', videos[currentPlayingIndex])
      }
    }
  } else {
    videoStats[id] = {
      progress,
      videoId,
      canisterId,
      profileId,
      count: 0,
      score,
    }
  }
}

onMount(async () => {
  updateURL()
  $playerState.initialized = false
  $playerState.muted = true
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
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onDestroy(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  if (loadTimeout) {
    clearTimeout(loadTimeout)
  }
})

beforeNavigate(() => {
  videos.length > 2 && homeFeedVideos.set(videos.slice(currentPlayingIndex))
  isDocumentHidden = true
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
  {#each videos as video, i (i)}
    <SwiperSlide
      class="flex h-full w-full snap-always items-center justify-center">
      {#if currentVideoIndex - 2 < i && currentVideoIndex + keepVideosLoadedCount > i}
        <HomeFeedPlayer
          {i}
          id={video.id}
          likeCount={Number(video.like_count)}
          displayName={video.created_by_display_name[0]}
          profileLink={video.created_by_unique_user_name[0] ??
            video.created_by_user_principal_id}
          liked={video.liked_by_me}
          description={video.description}
          createdById={video.created_by_user_principal_id}
          videoViews={Number(video.total_view_count)}
          publisherCanisterId={video.publisher_canister_id}
          userProfileSrc={video.created_by_profile_photo_url[0]}
          {individualUser}
          enrolledInHotOrNot={video.hot_or_not_feed_ranking_score &&
            video.hot_or_not_feed_ranking_score[0] !== undefined}
          thumbnail={getThumbnailUrl(video.video_uid)}
          on:like={() => {
            updatePostInWatchHistory('watch', videos[i], {
              liked_by_me: !videos[i].liked_by_me,
            })
            videos[i].liked_by_me = !videos[i].liked_by_me
          }}>
          <VideoPlayer
            bind:this={videoPlayers[i]}
            on:loaded={() => hideSplashScreen(500)}
            on:watchedPercentage={({ detail }) =>
              recordStats(
                detail,
                video.publisher_canister_id,
                video.id,
                video.created_by_unique_user_name[0] ??
                  video.created_by_user_principal_id,
                video.home_feed_ranking_score,
              )}
            {i}
            playFormat="hls"
            {Hls}
            isiPhone={isIPhone}
            inView={i == currentVideoIndex &&
              !isDocumentHidden &&
              pathname.includes('feed')}
            uid={video.video_uid} />
        </HomeFeedPlayer>
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
        <NoVideosIcon class="w-56" />
        <div class="text-center text-lg font-bold">
          No more videos to display today
        </div>
      </div>
    </SwiperSlide>
  {/if}
</Swiper>
