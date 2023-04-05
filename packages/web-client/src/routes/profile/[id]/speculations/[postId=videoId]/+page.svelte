<script lang="ts">
import { page } from '$app/stores'
import IconButton from '$components/button/IconButton.svelte'
import HotOrNotBet from '$components/hot-or-not/HotOrNotBet.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import PlayerLayout from '$components/layout/PlayerLayout.svelte'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import goBack from '$lib/utils/goBack'
import Hls from 'hls.js/dist/hls.min'
import type { PageData } from './$types'

export let data: PageData

let { post, me } = data
</script>

<svelte:head>
  <title>{me ? 'Your' : "User's"} Bets | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    {#if me != undefined}
      <div class="flex w-full items-center justify-center pt-2">
        <div class="rounded-full bg-black/50 px-4 py-2">
          {me ? 'Your' : "User's"} Bets
        </div>
      </div>
    {/if}

    <div class="absolute left-4 top-4">
      <IconButton
        on:click={() =>
          goBack(`/profile/${$page.params.id}?tab=speculations`, true)}>
        <CaretLeftIcon class="h-5 w-5" />
      </IconButton>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="relative h-full w-full text-white">
      <PlayerLayout
        bind:post
        index={0}
        watchHistoryDb="watch-hon"
        showReferAndEarnLink
        showShareButton
        showDescription
        let:recordView>
        <VideoPlayer
          on:watchedPercentage={({ detail }) => recordView(detail)}
          index={0}
          playFormat="hls"
          {Hls}
          inView
          uid={post.video_uid} />
        <svelte:fragment slot="hotOrNot">
          <HotOrNotBet
            profileUserId={$page.params.id}
            {post}
            {me}
            placedBetDetail={post.placed_bet_details}
            inView />
        </svelte:fragment>
      </PlayerLayout>
    </div>
  </svelte:fragment>
</HomeLayout>
