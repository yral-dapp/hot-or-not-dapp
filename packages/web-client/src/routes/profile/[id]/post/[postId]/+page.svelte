<script lang="ts">
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import type { PageData } from './$types'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import BottomNavigation from '$components/navigation/BottomNavigation.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import { page } from '$app/stores'
import { individualUser } from '$lib/helpers/backend'
import { isiPhone } from '$lib/utils/isSafari'
import HomeFeedPlayer from '$components/player/HomeFeedPlayer.svelte'
import Hls from 'hls.js/dist/hls.min'
import { authState } from '$stores/auth'
import { updatePostInWatchHistory } from '$lib/helpers/feed'
import { registerEvent } from '$components/seo/GA.svelte'
import userProfile from '$stores/userProfile'
import PlayerLayout from '$components/layout/PlayerLayout.svelte'

export let data: PageData

let { video, me } = data
</script>

<svelte:head>
  <title>{me ? 'Your' : "User's"} Videos | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    {#if me != undefined}
      <div class="flex w-full items-center justify-center pt-2">
        <div class="rounded-full bg-black/50 py-2 px-4">
          {me ? 'Your' : "User's"} Videos
        </div>
      </div>
    {/if}

    <div class="absolute top-4 left-4">
      <IconButton href={`/profile/${$page.params.id}`} preload>
        <CaretLeftIcon class="h-5 w-5" />
      </IconButton>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="relative h-full w-full text-white">
      <PlayerLayout
        bind:post={video}
        index={0}
        watchHistoryDb="watch"
        showLikeButton
        showReferAndEarnLink
        showShareButton
        showHotOrNotButton
        let:recordView>
        <VideoPlayer
          on:watchedPercentage={({ detail }) => recordView(detail)}
          index={0}
          playFormat="hls"
          {Hls}
          inView
          uid={video.video_uid} />
      </PlayerLayout>
    </div>
  </svelte:fragment>
  <div class="w-full" slot="bottom-navigation">
    <BottomNavigation />
  </div>
</HomeLayout>
