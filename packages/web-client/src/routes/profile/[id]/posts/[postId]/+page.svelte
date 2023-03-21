<script lang="ts">
import 'swiper/css'
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import type { PageData } from './$types'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import BottomNavigation from '$components/navigation/BottomNavigation.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { Swiper, SwiperSlide } from 'swiper/svelte'
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte'
import { isiPhone } from '$lib/utils/isSafari'
import HomeFeedPlayer from '$components/player/HomeFeedPlayer.svelte'
import Hls from 'hls.js/dist/hls.min'
import { updatePostInWatchHistory } from '$lib/helpers/feed'
import { authState } from '$stores/auth'
import { registerEvent } from '$components/seo/GA.svelte'
import userProfile from '$stores/userProfile'
import { individualUser } from '$lib/helpers/backend'

export let data: PageData

//@ts-ignore
const { video, me } = data

let videos = [video]
let noMoreVideos = true
let isIPhone = isiPhone()
let currentVideoIndex = 0

async function handleChange(e: CustomEvent) {
  const index = e.detail[0].realIndex
  currentVideoIndex = index
}

async function handleLike(videoIndex: number) {
  if (!$authState.isLoggedIn) {
    $authState.showLogin = true
    return
  }
  const post = videos[videoIndex]
  if (!post) return

  updatePostInWatchHistory('watch', post, {
    liked_by_me: !post.liked_by_me,
  })
  videos[videoIndex].liked_by_me = !videos[videoIndex].liked_by_me

  registerEvent('like_video', {
    userId: $userProfile.principal_id,
    video_publisher_id:
      post.created_by_unique_user_name[0] ?? post.created_by_user_principal_id,
    video_publisher_canister_id: post.publisher_canister_id,
    video_id: post.id,
    likes: post.like_count,
  })

  await individualUser(
    post.publisher_canister_id,
  ).update_post_toggle_like_status_by_caller(post.id)
}

async function handleShare(videoIndex: number) {
  const post = videos[videoIndex]
  if (!post) return
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: `Check out this hot video by ${post.created_by_display_name[0]}. \n${post.description}`,
      url: `https://hotornot.wtf/feed/${post.publisher_canister_id}@${post.id}`,
    })
  } catch (_) {}
  registerEvent('share_video', {
    userId: $userProfile.principal_id,
    video_publisher_id:
      post.created_by_unique_user_name[0] ?? post.created_by_user_principal_id,
    video_publisher_canister_id: post.publisher_canister_id,
    video_id: post.id,
  })
  await individualUser(
    post.publisher_canister_id,
  ).update_post_increment_share_count(post.id)
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
      <Swiper
        direction={'vertical'}
        observer
        on:slideChange={handleChange}
        slidesPerView={1}
        cssMode
        spaceBetween={100}
        class="h-full w-full">
        {#each videos as video, i (i)}
          <SwiperSlide
            class="flex h-full w-full snap-always items-center justify-center">
            <HomeFeedPlayer
              {i}
              id={video.id}
              likes={Number(video.like_count)}
              displayName={video.created_by_display_name[0]}
              profileLink={video.created_by_unique_user_name[0] ??
                video.created_by_user_principal_id}
              liked={video.liked_by_me}
              createdById={video.created_by_user_principal_id}
              videoViews={Number(video.total_view_count)}
              publisherCanisterId={video.publisher_canister_id}
              userProfileSrc={video.created_by_profile_photo_url[0]}
              enrolledInHotOrNot={video.hot_or_not_feed_ranking_score &&
                video.hot_or_not_feed_ranking_score[0] !== undefined}
              thumbnail={getThumbnailUrl(video.video_uid)}
              on:like={() => handleLike(i)}
              on:share={() => handleShare(i)}>
              <VideoPlayer
                {i}
                playFormat="hls"
                {Hls}
                isiPhone={isIPhone}
                inView={currentVideoIndex == i}
                uid={video.video_uid} />
            </HomeFeedPlayer>
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
