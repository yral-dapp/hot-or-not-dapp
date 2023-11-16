<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte'
import IconButton from '$components/button/IconButton.svelte'
import Icon from '$components/icon/Icon.svelte'
import { registerEvent } from '$components/analytics/GA.svelte'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import { generateRandomName } from '$lib/utils/randomUsername'
import { authState } from '$stores/auth'
import { debounce } from 'throttle-debounce'
import type { DislikeRecord, LikeRecord, UpDownPost } from '$lib/db/db.types'
import {
  shareVideo,
  toggleDislike,
  toggleLike,
  viewVideo,
} from '$lib/db/actions'
import { getDb } from '$lib/db'
import { doc, getDoc } from 'firebase/firestore'
import { getMsLeftForResult, getVoteEndTime } from '$lib/utils/countdown'
import type { Readable } from 'svelte/store'

export let index: number
export let post: UpDownPost
export let showShareButton = false
export let showLikeButton = false
export let showTimer = false
export let showDislikeButton = false
export let unavailable = false

let liked = false
let disliked = false

let watchProgress = {
  totalCount: 0,
  partialWatchedPercentage: 0,
}

async function updateLikeDislikeStatus() {
  const db = getDb()
  if (showLikeButton) {
    const likeDoc = (
      await getDoc(doc(db, `ud-videos/${post.id}/likes/${$authState.userId}`))
    ).data() as LikeRecord
    likeDoc && (liked = likeDoc.liked)
  }
  if (showDislikeButton) {
    const dislikeDoc = (
      await getDoc(
        doc(db, `ud-videos/${post.id}/dislikes/${$authState.userId}`),
      )
    ).data() as DislikeRecord
    dislikeDoc && (disliked = dislikeDoc.disliked)
  }
}

$: if ($authState.isLoggedIn) {
  updateLikeDislikeStatus()
}

function isLoggedIn() {
  if ($authState.isLoggedIn) return true
  $authState.showLogin = true
  return false
}

async function handleShare() {
  if (!isLoggedIn()) return
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: `Check out this video at UpDown! \n${post.description}`,
      url: `https://experiments.hotornot.wtf/up-down/${post.ouid}@${post.oid}`,
    })
  } catch (e) {
    console.warn("Can't share", e)
  } finally {
    await shareVideo({
      videoId: post.id,
      videoOid: post.oid,
      videoUoid: post.ouid,
      videoUid: post.video_uid,
    })

    registerEvent('share_video', {
      userId: $authState.userId,
      video_id: post.id,
      share_count: post.share_count,
      anon: !!$authState.isLoggedIn,
    })
  }
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
  if (!isLoggedIn()) return

  liked = !liked

  await toggleLike({
    videoId: post.id,
    videoOid: post.oid,
    videoUoid: post.ouid,
    videoUid: post.video_uid,
  })

  // updatePostInWatchHistory('up-down-watch-history', post, {
  //   liked_by_me: !post.liked_by_me,
  //   like_count: post.like_count + BigInt(post.liked_by_me ? -1 : 1),
  // })

  registerEvent('like_video', {
    userId: $authState.userId,
    video_id: post.id,
    likes: post.likes_count,
    anon: !!$authState.isLoggedIn,
  })
}

async function handleDislike() {
  if (!isLoggedIn()) return

  disliked = !disliked

  await toggleDislike({
    videoId: post.id,
    videoOid: post.oid,
    videoUoid: post.ouid,
    videoUid: post.video_uid,
  })

  // updatePostInWatchHistory('up-down-watch-history', post, {
  //   liked_by_me: !post.liked_by_me,
  //   like_count: post.like_count + BigInt(post.liked_by_me ? -1 : 1),
  // })

  registerEvent('dislike_video', {
    userId: $authState.userId,
    video_id: post.id,
    likes: post.likes_count,
    anon: !!$authState.isLoggedIn,
  })
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

  console.log('watchCount', watchCount)

  if (!watchCount) return

  await viewVideo(
    {
      videoId: post.id,
      videoOid: post.oid,
      videoUoid: post.ouid,
      videoUid: post.video_uid,
    },
    watchCount,
  )

  registerEvent('view_video', {
    userId: $authState.userId,
    video_id: post.id,
    view_count: post.views_count,
    anon: !!$authState.isLoggedIn,
  })
}

$: avatarUrl = getDefaultImageUrl(post.ouid)

const endTime = getVoteEndTime(new Date(post.created_at), new Date())
let timeLeft: Readable<string>
if (showTimer) {
  timeLeft = getMsLeftForResult(endTime, true)
}
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
              <span class="text-sm">{Math.round(post.views_count || 0)}</span>
            </div>
          </div>
        </div>
        <slot name="betRoomInfo" />
      </div>
      <div
        class="max-w-16 pointer-events-auto flex shrink-0 flex-col justify-end space-y-6 pb-2">
        {#if showLikeButton}
          <IconButton
            iconName={liked ? 'heart-fill-color' : 'heart-fill'}
            iconClass="h-8 w-8"
            ariaLabel="Toggle like on this post"
            on:click={(e) => {
              e.stopImmediatePropagation()
              handleLike()
            }} />
        {/if}
        {#if showDislikeButton}
          <IconButton
            iconName={disliked ? 'heart-broken-fill' : 'heart-broken'}
            iconClass="h-8 w-8"
            ariaLabel="Toggle like on this post"
            on:click={(e) => {
              e.stopImmediatePropagation()
              handleDislike()
            }} />
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
        {#if showTimer}
          <div class="flex flex-col items-center gap-1">
            <Icon
              name="stopwatch"
              class="h-7 w-7"
              on:click={(e) => {
                e.stopImmediatePropagation()
                handleLike()
              }} />
            <span class="text-fg-1 text-xs shadow-lg">{$timeLeft}</span>
          </div>
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
