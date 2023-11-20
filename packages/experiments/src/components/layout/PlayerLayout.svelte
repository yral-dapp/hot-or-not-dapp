<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte'
import IconButton from '$components/button/IconButton.svelte'
import Icon from '$components/icon/Icon.svelte'
import type { UpDownPost } from '$lib/db/db.types'
import { getLikeDislikeStatus } from '$lib/db/feed'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import { getMsLeftForResult, getVoteEndTime } from '$lib/utils/countdown'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import { generateRandomName } from '$lib/utils/randomUsername'
import { authState } from '$stores/auth'
import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte'
import type { Readable } from 'svelte/store'
import { debounce } from 'throttle-debounce'
import {
  dislikePost,
  likePost,
  sharePost,
  viewPost,
  type WatchProgress,
} from './PlayerLayout.actions'

export let index: number
export let post: UpDownPost
export let showShareButton = false
export let showLikeButton = false
export let showTimer = false
export let showDislikeButton = false
export let unavailable = false
export let single = false
export let show = false

const dispatch = createEventDispatcher<{
  view: number
}>()

let observer: IntersectionObserver | null = null
let liked = false
let disliked = false
let timeLeft: Readable<string>
const endTime = getVoteEndTime(new Date(post.created_at), new Date())
const avatarUrl = getDefaultImageUrl(post.ouid)
let playerLayoutEl: HTMLDivElement
let watchProgress: WatchProgress = {
  totalCount: 0,
  partialWatchedPercentage: 0,
}

// Action handling

function handleShare() {
  sharePost(post)
}

function handleLike() {
  if (!isLoggedIn()) return
  liked = !liked
  if (liked && disliked) disliked = false
  likePost(post)
}

async function handleDislike() {
  if (!isLoggedIn()) return

  disliked = !disliked
  if (liked && disliked) liked = false
  dislikePost(post)
}

// Utils

function isLoggedIn() {
  if ($authState.isLoggedIn) return true
  $authState.showLogin = true
  return false
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

// Setup

async function updateLikeDislikeStatus() {
  const status = await getLikeDislikeStatus(post.id)
  liked = status.liked
  disliked = status.disliked
}

async function setupIO() {
  if (single) return
  await tick()
  if (observer) return
  observer = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting) {
        dispatch('view', index)
      }
    },
    { threshold: 0.85 },
  )
  observer.observe(playerLayoutEl)
}

// Reactive

$: if ($authState.isLoggedIn) {
  updateLikeDislikeStatus()
}

async function updateStats() {
  viewPost(post, watchProgress)
}

$: if (showTimer) {
  timeLeft = getMsLeftForResult(endTime, true)
}

$: if (show) {
  setupIO()
} else {
  unload()
}

function unload() {
  observer?.disconnect()
  observer = null
}

onDestroy(unload)
</script>

<player-layout
  bind:this={playerLayoutEl}
  data-index={index}
  class="relative flex h-screen w-full shrink-0 snap-center snap-always items-center justify-center">
  {#if show}
    {#if !unavailable}
      <img
        alt="background"
        class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-xl"
        src={getThumbnailUrl(post.video_uid, 80)} />
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
              ariaLabel="Like this post"
              on:click={(e) => {
                e.stopImmediatePropagation()
                handleLike()
              }} />
          {/if}
          {#if showDislikeButton}
            <IconButton
              iconName={disliked ? 'heart-broken-fill' : 'heart-broken'}
              iconClass="h-8 w-8"
              ariaLabel="Dislike this post"
              on:click={(e) => {
                e.stopImmediatePropagation()
                handleDislike()
              }} />
          {/if}
          {#if showShareButton}
            <IconButton
              iconName="share-message"
              ariaLabel="Share this button"
              iconClass="h-6 w-6 drop-shadow-md"
              on:click={(e) => {
                e.stopImmediatePropagation()
                handleShare()
              }} />
          {/if}
          {#if showTimer}
            <div class="flex flex-col items-center gap-1">
              <Icon name="stopwatch" class="h-7 w-7" />
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
  {/if}
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
