<script lang="ts">
import 'swiper/css'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import type { PageData } from './$types'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import BottomNavigation from '$components/navigation/BottomNavigation.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import { page } from '$app/stores'
import { Swiper, SwiperSlide } from 'swiper/svelte'
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte'
import Hls from 'hls.js/dist/hls.min'
import { individualUser } from '$lib/helpers/backend'
import goBack from '$lib/utils/goBack'
import PlayerLayout from '$components/layout/PlayerLayout.svelte'

export let data: PageData

const { video, me } = data

let videos = [video]
let noMoreVideos = true
let currentVideoIndex = 0
let lastWatchedVideoIndex = -1

async function handleChange(e: CustomEvent) {
  lastWatchedVideoIndex = currentVideoIndex
  const index = e.detail[0].realIndex
  currentVideoIndex = index
}
</script>

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
      <IconButton on:click={() => goBack(`/profile/${$page.params.id}`, true)}>
        <CaretLeftIcon class="h-5 w-5" />
      </IconButton>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    {#if individualUser != undefined}
      <Swiper
        direction={'vertical'}
        observer
        on:slideChange={handleChange}
        slidesPerView={1}
        cssMode
        spaceBetween={100}
        class="h-full w-full">
        {#each videos as post, i (i)}
          <SwiperSlide
            class="flex h-full w-full snap-always items-center justify-center">
            <PlayerLayout
              bind:post
              index={i}
              watchHistoryDb="watch"
              showLikeButton
              showReferAndEarnLink
              showShareButton
              showHotOrNotButton
              justWatched={lastWatchedVideoIndex === i}
              let:recordView>
              <VideoPlayer
                on:watchedPercentage={({ detail }) => recordView(detail)}
                index={i}
                playFormat="hls"
                {Hls}
                inView
                uid={post.video_uid} />
            </PlayerLayout>
          </SwiperSlide>
          {#if noMoreVideos}
            <SwiperSlide class="flex h-full w-full items-center justify-center">
              <div
                class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
                <NoVideosIcon class="w-56" />
                <div class="text-center text-lg font-bold">Reached the end</div>
              </div>
            </SwiperSlide>
          {/if}
        {/each}
      </Swiper>
    {/if}
  </svelte:fragment>
  <div class="w-full" slot="bottom-navigation">
    <BottomNavigation />
  </div>
</HomeLayout>
