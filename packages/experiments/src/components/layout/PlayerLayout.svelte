<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte'
import IconButton from '$components/button/IconButton.svelte'
import Icon from '$components/icon/Icon.svelte'
import { registerEvent } from '$components/analytics/GA.svelte'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import Log from '$lib/utils/Log'
import { generateRandomName } from '$lib/utils/randomUsername'
import { getShortNumber } from '$lib/utils/shortNumber'
import { authState } from '$stores/auth'
import { debounce } from 'throttle-debounce'
import type { UpDownPost } from '$lib/db/db.types'

export let index: number
export let post: UpDownPost
export let showShareButton = false
export let showLikeButton = false
export let unavailable = false
export let source: 'ud-feed' | 'result'

let showTruncatedDescription = true
let watchProgress = {
  totalCount: 0,
  partialWatchedPercentage: 0,
}

async function handleShare() {
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: `Check out this video at UpDown! \n${post.description}`,
      url: `https://experiments.hotornot.wtf/up-down/${post.ouid}@${post.oid}`,
    })
  } catch (_) {}
  registerEvent('share_video', {
    source,
    userId: $authState.userId,
    video_publisher_id: post.ouid,
    video_id: post.oid,
  })
  // await individualUser(
  //   post.publisher_canister_id,
  // ).update_post_increment_share_count(post.id)
}

function recordView(percentageWatched: number) {
  if (percentageWatched < 2) {
    increaseWatchCount()
  } else {
    watchProgress.partialWatchedPercentage = percentageWatched
  }
}

const increaseWatchCount = debounce(500, () => {
  watchProgress.totalCount++
  watchProgress.partialWatchedPercentage = 0
  post.views_count++
  post = post
})

async function handleLike() {
  if (!$authState.isLoggedIn) {
    $authState.showLogin = true
    return
  }

  // updatePostInWatchHistory('up-down-watch-history', post, {
  //   liked_by_me: !post.liked_by_me,
  //   like_count: post.like_count + BigInt(post.liked_by_me ? -1 : 1),
  // })

  // post.liked = !post.liked
  // post.likes_count = post.likes_count + (post.liked ? -1 : 1);
  // post=post;

  // registerEvent('like_video', {
  //   source,
  //   userId: $userProfile.principal_id,
  //   video_publisher_id:
  //     post.created_by_unique_user_name[0] ?? post.created_by_user_principal_id,
  //   video_publisher_canister_id: post.publisher_canister_id,
  //   video_id: post.id,
  //   likes: post.like_count,
  // })

  try {
    // await individualUser(
    //   post.publisher_canister_id,
    // ).update_post_toggle_like_status_by_caller(post.id)
  } catch (e) {
    // updatePostInWatchHistory(watchHistoryDb, post, {
    //   liked_by_me: post.liked_by_me,
    //   like_count: post.like_count,
    // })
  }
}

async function updateStats() {
  if (
    watchProgress?.totalCount === 0 &&
    watchProgress?.partialWatchedPercentage === 0
  ) {
    return
  }

  // updatePostInWatchHistory(watchHistoryDb, post)

  const watchCount =
    (watchProgress?.totalCount || 0) +
    (watchProgress?.partialWatchedPercentage || 0)

  if (!watchCount) return

  Log('info', 'Updating watch stats', {
    from: 'PlayerLayout.updateStats',
    id: post.oid,
    i: index,
    watch_count: watchCount,
  })

  registerEvent('view_video', {
    source,
    id: post.oid,
    i: index,
    watch_count: watchCount,
  })
  try {
    // await individualUser(
    //   post.publisher_canister_id,
    // ).update_post_add_view_details(post.id, payload)
  } catch (e) {
    // Log('error', 'Could not update watch stats', {
    //   from: 'PlayerLayout.updateStats',
    //   i: index,
    //   watchCount,
    //   e,
    // })
  }
}

$: avatarUrl = getDefaultImageUrl(post.ouid)
</script>

<player-layout
  data-index={index}
  class="relative block h-full w-full items-center justify-center overflow-auto transition-all duration-500">
  {#if !unavailable}
    <img
      alt="background"
      class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-xl"
      src={getThumbnailUrl(post.video_uid)} />
  {/if}

  <div
    style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%);"
    class="fade-in pointer-events-none absolute bottom-0 z-[10] block h-full w-full">
    <div
      style="-webkit-transform: translate3d(0, 0, 0);"
      class="absolute z-[10] flex w-screen space-x-2 pl-4 pr-2 {$$slots.controls
        ? 'bottom-40'
        : 'bottom-20'}">
      <div class="flex grow flex-col justify-end space-y-4">
        <div
          aria-roledescription="video-info"
          class="pointer-events-auto flex space-x-3">
          <Avatar class="h-12 w-12" src={avatarUrl} />
          <div class="flex flex-col space-y-1">
            {generateRandomName('name', post.ouid)}
            <div class="flex items-center space-x-1">
              <Icon name="eye-open" class="h-4 w-4 text-white" />
              <span class="text-sm">{post.views_count}</span>
            </div>
          </div>
        </div>
        <slot name="betRoomInfo" />
      </div>
      <div
        class="max-w-16 pointer-events-auto flex shrink-0 flex-col justify-end space-y-6 pb-2">
        {#if showLikeButton}
          <div class="flex flex-col">
            <IconButton
              iconName={post.likes_count && $authState.isLoggedIn
                ? 'heart-fill-color'
                : 'heart-fill'}
              iconClass="h-8 w-8"
              ariaLabel="Toggle like on this post"
              on:click={(e) => {
                e.stopImmediatePropagation()
                handleLike()
              }} />
            <span class="text-center text-sm drop-shadow-md">
              {getShortNumber(post.likes_count)}
            </span>
          </div>
        {/if}
        {#if showShareButton}
          <IconButton
            iconName="share-message"
            iconClass="h-6 w-6 drop-shadow-md"
            on:click={(e) => {
              e.stopImmediatePropagation()
              handleShare()
            }} />
        {/if}
      </div>
    </div>
    {#if $$slots.controls}
      <div
        style="-webkit-transform: translate3d(0, 0, 0);"
        class="absolute inset-x-0 bottom-0 z-[5] h-40 w-full">
        <slot name="controls" />
      </div>
    {/if}
  </div>
  <slot {recordView} {updateStats} />
</player-layout>

<style>
:global(.animate-wobble) {
  animation: 6s ease 1s wobble infinite;
}
@keyframes wobble {
  30% {
    transform: scale(1.2);
  }
  40%,
  60% {
    transform: rotate(-10deg) scale(1.2);
  }
  50% {
    transform: rotate(10deg) scale(1.2);
  }
  70% {
    transform: rotate(0deg) scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
