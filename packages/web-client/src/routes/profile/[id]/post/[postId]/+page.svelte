<script lang="ts">
import { page } from '$app/stores'
import IconButton from '@hnn/components/button/IconButton.svelte'
import HomeLayout from '@hnn/components/web-client/layout/HomeLayout.svelte'
import PlayerLayout from '$lib/components/layout/PlayerLayout.svelte'
import BottomNavigation from '@hnn/components/web-client/navigation/BottomNavigation.svelte'
import VideoPlayer from '$lib/components/video/VideoPlayer.svelte'
import goBack from '$lib/utils/goBack'
import type { PageData } from './$types'
import { playerState } from '$lib/stores/app'
import VideoSlide from '@hnn/components/video/VideoSlide.svelte'
import { browser } from '$app/environment'

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
        <div class="rounded-full bg-black/50 px-4 py-2">
          {me ? 'Your' : "User's"} Videos
        </div>
      </div>
    {/if}

    <div class="absolute left-4 top-4">
      <IconButton
        iconName="caret-left"
        iconClass="h-5 w-5"
        on:click={() => goBack(`/profile/${$page.params.id}`, true)} />
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="relative h-full w-full text-white">
      {#if video}
        <VideoSlide show single index={0} {browser}>
          <PlayerLayout
            bind:post={video}
            index={0}
            source="post"
            watchHistoryDb="watch"
            showReportButton
            showLikeButton
            showDescription
            showReferAndEarnLink
            showShareButton
            showHotOrNotButton
            let:unavailable
            let:recordView>
            <VideoPlayer
              on:watchedPercentage={({ detail }) => recordView(detail)}
              {unavailable}
              index={0}
              playFormat="hls"
              inView
              uid={video.video_uid} />
          </PlayerLayout>
        </VideoSlide>
      {/if}
    </div>
  </svelte:fragment>
  <div class="w-full" slot="bottom-navigation">
    <BottomNavigation
      feedUrl={$playerState.currentFeedUrl == 'no-videos'
        ? ''
        : $playerState.currentFeedUrl}
      pathName={$page.url.pathname} />
  </div>
</HomeLayout>
