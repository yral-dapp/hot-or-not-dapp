<script lang="ts">
import 'swiper/css'
import type { IndividualUserActor } from '$lib/helpers/backend'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import type { PageData } from './$types'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import BottomNavigation from '$components/navigation/BottomNavigation.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { register as initSwiper } from 'swiper/element/bundle'
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte'
import { isiPhone } from '$lib/utils/isSafari'
import HomeFeedPlayer from '$components/player/HomeFeedPlayer.svelte'
import Hls from 'hls.js'
import { onMount } from 'svelte'

export let data: PageData

//@ts-ignore
const { video, me } = data

let videos = [video]
let noMoreVideos = true
let isIPhone = isiPhone()
let currentVideoIndex = 0

let individualUser: undefined | (() => IndividualUserActor) = undefined

async function handleChange(e: CustomEvent) {
  const index = e.detail[0].realIndex
  currentVideoIndex = index
}

onMount(() => initSwiper())
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
      <IconButton
        on:click={() =>
          history.length > 2
            ? history.back()
            : goto(`/profile/${$page.params.id}`)}>
        <CaretLeftIcon class="h-5 w-5" />
      </IconButton>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    {#if individualUser != undefined}
      <swiper-container
        direction="vertical"
        observer="true"
        css-mode="true"
        slides-per-view="1"
        class="h-full w-full"
        on:slidechange={(e) => handleChange(e)}>
        {#each videos as video, i (i)}
          <swiper-slide
            class="flex h-full w-full snap-always items-center justify-center">
            <HomeFeedPlayer
              {i}
              id={video.id}
              likeCount={Number(video.like_count)}
              displayName={video.created_by_display_name[0]}
              profileLink={video.created_by_unique_user_name[0] ??
                video.created_by_user_principal_id}
              liked={video.liked_by_me}
              description={video.description}
              createdById={video.created_by_user_principal_id}
              videoViews={Number(video.total_view_count)}
              publisherCanisterId={video.publisher_canister_id}
              userProfileSrc={video.created_by_profile_photo_url[0]}
              {individualUser}
              enrolledInHotOrNot={video.hot_or_not_feed_ranking_score &&
                video.hot_or_not_feed_ranking_score[0] !== undefined}
              thumbnail={getThumbnailUrl(video.video_uid)}>
              <VideoPlayer
                {i}
                playFormat="hls"
                {Hls}
                isiPhone={isIPhone}
                inView={currentVideoIndex == i}
                uid={video.video_uid} />
            </HomeFeedPlayer>
          </swiper-slide>
          {#if noMoreVideos}
            <swiper-slide
              class="flex h-full w-full items-center justify-center">
              <div
                class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
                <NoVideosIcon class="w-56" />
                <div class="text-center text-lg font-bold">Reached the end</div>
              </div>
            </swiper-slide>
          {/if}
        {/each}
      </swiper-container>
    {/if}
  </svelte:fragment>
  <div class="w-full" slot="bottom-navigation">
    <BottomNavigation />
  </div>
</HomeLayout>
