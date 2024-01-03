<script lang="ts">
import { page } from '$app/stores'
import IconButton from '@hnn/components/button/IconButton.svelte'
import HomeLayout from '@hnn/components/layout/HomeLayout.svelte'
import PlayerLayout from '$lib/components/layout/PlayerLayout.svelte'
import BottomNavigation from '@hnn/components/web-client/navigation/BottomNavigation.svelte'
import VideoPlayer from '$lib/components/video/VideoPlayer.svelte'
import goBack from '$lib/utils/goBack'
import type { PageData } from './$types'

export let data: PageData

let { video, me } = data
let unavailable = false

$: console.log({ video })
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
        <PlayerLayout
          single
          show
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
          {unavailable}
          let:recordView>
          <VideoPlayer
            on:videoUnavailable={() => (unavailable = true)}
            on:watchedPercentage={({ detail }) => recordView(detail)}
            index={0}
            playFormat="hls"
            inView
            uid={video.video_uid} />
        </PlayerLayout>
      {/if}
    </div>
  </svelte:fragment>
  <div class="w-full" slot="bottom-navigation">
    <BottomNavigation />
  </div>
</HomeLayout>
