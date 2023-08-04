<script lang="ts">
import { page } from '$app/stores'
import IconButton from '$components/button/IconButton.svelte'
import HotOrNotVote from '$components/hot-or-not/HotOrNotVote.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import PlayerLayout from '$components/layout/PlayerLayout.svelte'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import goBack from '$lib/utils/goBack'
import Hls from 'hls.js/dist/hls.min.js'
import type { PageData } from './$types'
import Icon from '$components/icon/Icon.svelte'

export let data: PageData

let { post, me } = data
let unavailable = false
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
        on:click={() =>
          goBack(`/profile/${$page.params.id}?tab=speculations`, true)}>
        <Icon name="caret-left" class="h-5 w-5" />
      </IconButton>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="relative h-full w-full text-white">
      <PlayerLayout
        bind:post
        index={0}
        source="speculation"
        watchHistoryDb="watch-hon"
        showReferAndEarnLink
        showShareButton
        showDescription
        {unavailable}
        let:recordView>
        <VideoPlayer
          on:videoUnavailable={() => (unavailable = true)}
          on:watchedPercentage={({ detail }) => recordView(detail)}
          index={0}
          playFormat="hls"
          {Hls}
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
    </div>
  </svelte:fragment>
</HomeLayout>
