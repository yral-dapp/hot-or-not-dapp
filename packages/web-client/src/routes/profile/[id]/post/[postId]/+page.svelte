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

export let data: PageData

const { video, me } = data
let isIPhone = isiPhone()

async function handleLike() {
  if (!$authState.isLoggedIn) {
    $authState.showLogin = true
    return
  }

  if (!video) return

  updatePostInWatchHistory('watch', video, {
    liked_by_me: !video.liked_by_me,
  })

  video.liked_by_me = !video.liked_by_me

  registerEvent('like_video', {
    userId: $userProfile.principal_id,
    video_publisher_id:
      video.created_by_unique_user_name[0] ??
      video.created_by_user_principal_id,
    video_publisher_canister_id: video.publisher_canister_id,
    video_id: video.id,
    likes: video.like_count,
  })

  await individualUser(
    video.publisher_canister_id,
  ).update_post_toggle_like_status_by_caller(video.id)
}

async function handleShare() {
  if (!video) return
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: `Check out this hot video by ${video.created_by_display_name[0]}. \n${video.description}`,
      url: `https://hotornot.wtf/feed/${video.publisher_canister_id}@${video.id}`,
    })
  } catch (_) {
    //TODO
  }
  registerEvent('share_video', {
    userId: $userProfile.principal_id,
    video_publisher_id:
      video.created_by_unique_user_name[0] ??
      video.created_by_user_principal_id,
    video_publisher_canister_id: video.publisher_canister_id,
    video_id: video.id,
  })
  await individualUser(
    video.publisher_canister_id,
  ).update_post_increment_share_count(video.id)
}
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
      <HomeFeedPlayer
        i={0}
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
        on:like={() => handleLike()}
        on:share={() => handleShare()}>
        <VideoPlayer
          i={0}
          playFormat="hls"
          {Hls}
          isiPhone={isIPhone}
          inView
          uid={video.video_uid} />
      </HomeFeedPlayer>
    </div>
  </svelte:fragment>
  <div class="w-full" slot="bottom-navigation">
    <BottomNavigation />
  </div>
</HomeLayout>
