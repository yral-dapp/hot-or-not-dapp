<script lang="ts">
import VideoPlayer from '$components/video/VideoPlayer.svelte'
import { getMp4Url, getThumbnailUrl } from '$lib/utils/cloudflare'
import type { PageData } from './$types'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import BottomNavigation from '$components/navigation/BottomNavigation.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import { page } from '$app/stores'
import { individualUser } from '$lib/helpers/backend'
import { isiPhone } from '$lib/utils/isSafari'
import HomeFeedPlayer from '$components/player/HomeFeedPlayer.svelte'

export let data: PageData

const { video, me } = data
let isIPhone = isiPhone()
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
          i={0}
          playFormat="hls"
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
