<script lang="ts">
import { beforeNavigate } from '$app/navigation'
import Button from '$components/button/Button.svelte'
import Icon from '$components/icon/Icon.svelte'
import PlayerLayout from '$components/layout/PlayerLayout.svelte'
import PlayerRenderer from '$components/video/PlayerRenderer.svelte'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import {
  getTopPosts,
  getWatchedVideosFromCache,
  updatePostInWatchHistory,
  type PostPopulated,
} from '$lib/helpers/feed'
import Log from '$lib/utils/Log'
import { updateURL } from '$lib/utils/feedUrl'
import { handleParams } from '$lib/utils/params'
import { joinArrayUniquely } from '$lib/utils/video'
import { homeFeedVideos, playerState } from '$stores/playerState'
import { removeSplashScreen } from '$stores/popups'
import { onMount, tick } from 'svelte'
import { debounce } from 'throttle-debounce'
import type { PageData } from './$types'

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

const handleChange = debounce(250, (newIndex: number) => {
  currentVideoIndex = newIndex
  fetchNextVideos()
  updateURL(videos[currentVideoIndex])
})

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

<div
  style="height: 100dvh;"
  class="hide-scrollbar relative flex w-full snap-y snap-mandatory flex-col overflow-hidden overflow-y-auto">
  {#each videos as post, index (index)}
    <PlayerRenderer
      {keepVideosLoadedCount}
      {index}
      activeIndex={currentVideoIndex}
      let:show>
      <PlayerLayout
        bind:post
        {index}
        {show}
        source="main_feed"
        watchHistoryDb="watch"
        showReportButton
        showLikeButton
        showReferAndEarnLink
        showShareButton
        showDescription
        showHotOrNotButton
        let:recordView
        let:updateStats
        on:view={({ detail }) => handleChange(detail)}>
        <VideoPlayer
          on:watchComplete={updateStats}
          on:loaded={() => removeSplashScreen()}
          on:watchedPercentage={({ detail }) => recordView(detail)}
          on:videoUnavailable={() => handleUnavailableVideo(index)}
          {index}
          playFormat="hls"
          inView={index == currentVideoIndex && $playerState.visible}
          uid={post.video_uid} />
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
        href="/hotornot">
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
      <Icon name="videos-graphic" class="w-56" />
      <div class="text-center text-lg font-bold">
        No more videos to display today
      </div>
    </div>
  {/if}
</div>
