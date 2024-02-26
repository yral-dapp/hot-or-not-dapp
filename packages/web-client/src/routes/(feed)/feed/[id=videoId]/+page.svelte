<script lang="ts">
import { beforeNavigate } from '$app/navigation'
import Button from '@hnn/components/button/Button.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import PlayerRenderer from '@hnn/components/video/PlayerRenderer.svelte'
import VideoSlide from '@hnn/components/video/VideoSlide.svelte'
import PlayerLayout from '$lib/components/layout/PlayerLayout.svelte'
import VideoPlayer from '$lib/components/video/VideoPlayer.svelte'
import {
  getTopPosts,
  getWatchedVideosFromCache,
  type PostPopulated,
} from '$lib/helpers/feed'
import Log from '$lib/utils/Log'
import { updateURL } from '$lib/utils/feedUrl'
import { handleParams } from '$lib/utils/params'
import { joinArrayUniquely } from '$lib/utils/video'
import { appPrefs, homeFeedVideos, playerState } from '$lib/stores/app'
import { removeSplashScreen } from '$lib/stores/popups'
import { onDestroy, onMount, tick } from 'svelte'
import { debounce } from 'throttle-debounce'
import type { PageData } from './$types'
import { browser } from '$app/environment'
import { clearMonitoring, monitorForUserStudy } from '$lib/helpers/user-study'
import { authState } from '$lib/stores/auth'

export let data: PageData

const fetchCount = 25
const fetchWhenVideosLeft = 10
const keepVideosLoadedCount: number = 3

let videos: PostPopulated[] = data.post ? [data.post] : []
let currentVideoIndex = 0
let noMoreVideos = false
let loading = false
let fetchedVideosCount = 0
let userStudyInit = false

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
      const res = await getTopPosts(
        fetchedVideosCount,
        fetchCount,
        true,
        $appPrefs.showNsfwVideos,
      )
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
  if (videos.length) {
    updateURL(videos[0])
  }
}

const handleChange = debounce(250, (newIndex: number) => {
  if (newIndex != currentVideoIndex) {
    currentVideoIndex = newIndex
    fetchNextVideos()
    updateURL(videos[currentVideoIndex])
  }

  // User study
  if (!userStudyInit && currentVideoIndex > 2) {
    userStudyInit = true
    monitorForUserStudy($authState.idString || '', 20)
  }
})

onMount(async () => {
  $playerState.initialized = false
  $playerState.muted = true
  $playerState.visible = true
  if (!data?.post) {
    videos = $homeFeedVideos
    $homeFeedVideos = []
  }
  await tick()
  fetchNextVideos()
  handleParams()
})

beforeNavigate(() => {
  $playerState.visible = false
  $playerState.muted = true
  if (loadTimeout) {
    clearTimeout(loadTimeout)
  }
})

onDestroy(() => clearMonitoring())
</script>

<svelte:head>
  <title>Home Feed | Hot or Not</title>
</svelte:head>

<div
  style="height: 100dvh;"
  class="hide-scrollbar relative flex w-full snap-y snap-mandatory flex-col overflow-hidden overflow-y-auto">
  {#each videos as post, index (index)}
    <PlayerRenderer
      {browser}
      {keepVideosLoadedCount}
      {index}
      activeIndex={currentVideoIndex}
      let:show>
      <VideoSlide
        {show}
        {index}
        {browser}
        on:view={({ detail }) => handleChange(detail)}>
        <PlayerLayout
          bind:post
          {index}
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
          let:unavailable
          on:unavailable={() => handleUnavailableVideo(index)}>
          <VideoPlayer
            {unavailable}
            on:watchComplete={updateStats}
            on:loaded={removeSplashScreen}
            on:watchedPercentage={({ detail }) => recordView(detail)}
            on:videoUnavailable={() => handleUnavailableVideo(index)}
            {index}
            playFormat="hls"
            inView={index == currentVideoIndex && $playerState.visible}
            uid={post.video_uid} />
        </PlayerLayout>
      </VideoSlide>
    </PlayerRenderer>
  {/each}
  {#if showError}
    <VideoSlide
      show
      index={videos.length}
      {browser}
      on:view={({ detail }) => handleChange(detail)}>
      <div class="text-center text-lg font-bold">
        Error loading posts. Please, refresh the page.
      </div>
      <Button
        type="primary"
        on:click={(e) => e.preventDefault()}
        href="/hotornot">
        Clear here to refresh
      </Button>
    </VideoSlide>
  {/if}
  {#if loading}
    <VideoSlide
      show
      index={videos.length}
      {browser}
      on:view={({ detail }) => handleChange(detail)}>
      <div class="text-center text-lg font-bold">Loading</div>
    </VideoSlide>
  {/if}
  {#if noMoreVideos}
    <VideoSlide
      show
      index={videos.length}
      {browser}
      on:view={({ detail }) => handleChange(detail)}>
      <Icon name="videos-graphic" class="w-56" />
      <div class="text-center text-lg font-bold">
        No more videos to display today
      </div>
    </VideoSlide>
  {/if}
</div>
