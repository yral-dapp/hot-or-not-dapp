<script lang="ts">
import { beforeNavigate } from '$app/navigation'
import PlayerLayout from '$components/layout/PlayerLayout.svelte'
import UpDownVote from '$components/up-down/UpDownVote.svelte'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import type { UpDownPost } from '$lib/db/db.types'
import { updateURL } from '$lib/utils/feedUrl'
import { playerState } from '$stores/playerState'
import { hideSplashScreen } from '$stores/popups'
import Hls from 'hls.js/dist/hls.min.js'
import { onMount } from 'svelte'
import 'swiper/css'

let video: UpDownPost
let loading = true

async function fetchVideo() {}

onMount(async () => {
  updateURL()
  $playerState.initialized = false
  $playerState.muted = true
  $playerState.visible = true
  fetchVideo()
})

beforeNavigate(() => {
  $playerState.visible = false
  $playerState.muted = true
})
</script>

<svelte:head>
  <title>Your Votes | Hot or Not</title>
</svelte:head>

<div class="flex h-full w-full snap-always items-center justify-center">
  <PlayerLayout
    bind:post={video}
    index={0}
    source="ud-feed"
    showLikeButton
    showDislikeButton
    showTimer
    showShareButton
    let:recordView
    let:updateStats>
    <VideoPlayer
      on:loaded={() => hideSplashScreen(500)}
      index={0}
      playFormat="hls"
      {Hls}
      inView
      uid={video.video_uid} />

    <svelte:fragment slot="controls">
      <UpDownVote post={video} score={video.score} />
    </svelte:fragment>
  </PlayerLayout>

  {#if loading}
    <div class="flex h-full w-full items-center justify-center">
      <div
        class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
        <div class="text-center text-lg font-bold">Loading</div>
      </div>
    </div>
  {/if}
</div>
