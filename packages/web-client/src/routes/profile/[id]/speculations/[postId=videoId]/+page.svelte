<script lang="ts">
import { page } from '$app/stores'
import IconButton from '@hnn/components/button/IconButton.svelte'
import HomeLayout from '@hnn/components/web-client/layout/HomeLayout.svelte'
import HotOrNotVote from '$lib/components/voting/HotOrNotVote.svelte'
import PlayerLayout from '$lib/components/layout/PlayerLayout.svelte'
import VideoPlayer from '$lib/components/video/VideoPlayer.svelte'
import goBack from '$lib/utils/goBack'
import type { PageData } from './$types'
import VideoSlide from '@hnn/components/video/VideoSlide.svelte'
import { browser } from '$app/environment'

export let data: PageData

let { post, me } = data
</script>

<svelte:head>
  <title>{me ? 'Your' : "User's"} Participations | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    {#if me != undefined}
      <div class="flex w-full items-center justify-center pt-2">
        <div class="rounded-full bg-black/50 px-4 py-2">
          {me ? 'Your' : "User's"} HotOrNot
        </div>
      </div>
    {/if}

    <div class="absolute left-4 top-4">
      <IconButton
        iconName="caret-left"
        iconClass="h-5 w-5"
        on:click={() =>
          goBack(`/profile/${$page.params.id}?tab=speculations`, true)} />
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="relative h-full w-full text-white">
      {#if post}
        <VideoSlide show single index={0} {browser}>
          <PlayerLayout
            bind:post
            index={0}
            source="speculation"
            watchHistoryDb="watch-hon"
            showReferAndEarnLink
            showShareButton
            showDescription
            let:unavailable
            let:recordView>
            <VideoPlayer
              {unavailable}
              on:watchedPercentage={({ detail }) => recordView(detail)}
              index={0}
              playFormat="hls"
              inView
              uid={post.video_uid} />
            <svelte:fragment slot="hotOrNot">
              <HotOrNotVote
                profileUserId={$page.params.id}
                {post}
                {me}
                placedBetDetail={post.placed_bet_details}
                inView />
            </svelte:fragment>
          </PlayerLayout>
        </VideoSlide>
      {/if}
    </div>
  </svelte:fragment>
</HomeLayout>
