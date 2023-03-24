<script lang="ts">
import { page } from '$app/stores'
import Avatar from '$components/avatar/Avatar.svelte'
import IconButton from '$components/button/IconButton.svelte'
import EyeIcon from '$components/icons/EyeIcon.svelte'
import FireIcon from '$components/icons/FireIcon.svelte'
import GiftBoxIcon from '$components/icons/GiftBoxIcon.svelte'
import HeartIcon from '$components/icons/HeartIcon.svelte'
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte'
import { registerEvent } from '$components/seo/GA.svelte'
import { individualUser } from '$lib/helpers/backend'
import { updatePostInWatchHistory, type PostPopulated } from '$lib/helpers/feed'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import Log from '$lib/utils/Log'
import { generateRandomName } from '$lib/utils/randomUsername'
import { getShortNumber } from '$lib/utils/shortNumber'
import { authState } from '$stores/auth'
import userProfile from '$stores/userProfile'

export let index: number
export let justWatched: boolean = false
export let post: PostPopulated
export let showReferAndEarnLink = false
export let showShareButton = false
export let showLikeButton = false
export let showHotOrNotButton = false
export let watchHistoryDb: 'watch' | 'watch-hon'

let showTruncatedDescription = true
let watchProgress = {
  totalCount: 0,
  partialWatchedPercentage: 0,
}

$: postPublisherId =
  post.created_by_unique_user_name[0] || post.created_by_user_principal_id
$: displayName = post.created_by_display_name[0]
$: enrolledInHotOrNot =
  post.hot_or_not_feed_ranking_score &&
  post.hot_or_not_feed_ranking_score[0] !== undefined

async function handleShare() {
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: `Check out this hot video by ${displayName}. \n${post.description}`,
      url: `https://hotornot.wtf/feed/${post.publisher_canister_id}@${Number(
        post.id,
      )}`,
    })
  } catch (_) {}
  registerEvent('share_video', {
    userId: $userProfile.principal_id,
    video_publisher_id: postPublisherId,
    video_publisher_canister_id: post.publisher_canister_id,
    video_id: post.id,
  })
  await individualUser(
    post.publisher_canister_id,
  ).update_post_increment_share_count(post.id)
}

function recordView(percentageWatched: number) {
  if (percentageWatched == 0) {
    watchProgress.totalCount++
    watchProgress.partialWatchedPercentage = 0
    post.total_view_count = post.total_view_count + BigInt(1)
    updatePostInWatchHistory(watchHistoryDb, post)
  } else {
    watchProgress.partialWatchedPercentage = percentageWatched
  }
}

async function handleLike() {
  if (!$authState.isLoggedIn) {
    $authState.showLogin = true
    return
  }

  updatePostInWatchHistory(watchHistoryDb, post, {
    liked_by_me: !post.liked_by_me,
    like_count: post.like_count + BigInt(post.liked_by_me ? -1 : 1),
  })

  post = {
    ...post,
    liked_by_me: !post.liked_by_me,
    like_count: post.like_count + BigInt(post.liked_by_me ? -1 : 1),
  }

  registerEvent('like_video', {
    userId: $userProfile.principal_id,
    video_publisher_id:
      post.created_by_unique_user_name[0] ?? post.created_by_user_principal_id,
    video_publisher_canister_id: post.publisher_canister_id,
    video_id: post.id,
    likes: post.like_count,
  })

  try {
    await individualUser(
      post.publisher_canister_id,
    ).update_post_toggle_like_status_by_caller(post.id)
  } catch (e) {
    updatePostInWatchHistory(watchHistoryDb, post, {
      liked_by_me: post.liked_by_me,
      like_count: post.like_count,
    })

    post = {
      ...post,
      liked_by_me: post.liked_by_me,
      like_count: post.like_count,
    }
  }
}

async function updateStats() {
  console.log('updating stats', index)
  if (
    watchProgress?.totalCount === 0 &&
    watchProgress?.partialWatchedPercentage === 0
  ) {
    return
  }

  if ($page.url.host.includes('t:')) return

  const payload =
    watchProgress.totalCount == 0
      ? {
          WatchedPartially: {
            percentage_watched:
              Math.ceil(watchProgress.partialWatchedPercentage) || 1,
          },
        }
      : {
          WatchedMultipleTimes: {
            percentage_watched:
              Math.ceil(watchProgress.partialWatchedPercentage) || 1,
            watch_count: watchProgress.totalCount,
          },
        }

  Log({ from: '0 updateStats', id: post.id, payload }, 'info')

  registerEvent('view_video', {
    userId: $userProfile.principal_id,
    video_publisher_id: postPublisherId,
    video_publisher_canister_id: post.publisher_canister_id,
    video_id: post.id,
    watch_count: Math.ceil(
      watchProgress.totalCount + watchProgress.partialWatchedPercentage / 100,
    ),
    home_feed_score: post.score,
  })
  await individualUser(post.publisher_canister_id).update_post_add_view_details(
    post.id,
    payload,
  )
}

$: if (justWatched) {
  updateStats()
}
</script>

<player-layout
  data-index={index}
  class="block h-full w-full items-center justify-center overflow-auto transition-all duration-500">
  <slot {recordView} />
  <img
    alt="background"
    class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-xl"
    src={getThumbnailUrl(post.video_uid)} />

  <div
    style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%);"
    class="fade-in pointer-events-none absolute bottom-0 z-[10] block h-full w-full">
    <div
      style="-webkit-transform: translate3d(0, 0, 0);"
      class="absolute z-[10] flex w-full space-x-2 px-4 {$$slots.hotOrNot
        ? 'bottom-40'
        : 'bottom-20'}">
      <div class="flex grow flex-col justify-end space-y-4">
        <div class="pointer-events-auto flex space-x-3">
          <a href="/profile/{postPublisherId}" class="h-12 w-12 shrink-0">
            <Avatar
              class="h-12 w-12"
              src={post.created_by_profile_photo_url[0] ||
                getDefaultImageUrl(post.created_by_user_principal_id)} />
          </a>
          <div class="flex flex-col space-y-1">
            <a href="/profile/{postPublisherId}">
              {displayName ||
                generateRandomName('name', post.created_by_user_principal_id)}
            </a>
            <div class="flex items-center space-x-1">
              <EyeIcon class="h-4 w-4 text-white" />
              <span class="text-sm">{Number(post.total_view_count)}</span>
            </div>
          </div>
        </div>
        <button
          class:truncate={showTruncatedDescription}
          on:click|stopImmediatePropagation={(e) => {
            showTruncatedDescription = !showTruncatedDescription
          }}
          class="pointer-events-auto w-80 text-left text-sm">
          {post.description}
        </button>
        <slot name="additionalInfo" />
      </div>
      <div class="max-w-16 flex shrink-0 flex-col space-y-6">
        {#if showReferAndEarnLink}
          <IconButton ariaLabel="Share this post" href="/refer-earn">
            <GiftBoxIcon class="h-8 w-8" />
          </IconButton>
        {/if}
        {#if showLikeButton}
          <div class="flex flex-col">
            <IconButton
              ariaLabel="Toggle like on this post"
              on:click={(e) => {
                e.stopImmediatePropagation()
                handleLike()
              }}>
              <HeartIcon
                filled={post.liked_by_me && $authState.isLoggedIn}
                class="h-8 w-8" />
            </IconButton>
            <span class="text-center text-sm drop-shadow-sm">
              {getShortNumber(Number(post.like_count))}
            </span>
          </div>
        {/if}
        {#if showShareButton}
          <IconButton
            on:click={(e) => {
              e.stopImmediatePropagation()
              handleShare()
            }}>
            <ShareMessageIcon class="h-6 w-6" />
          </IconButton>
        {/if}
        {#if showHotOrNotButton}
          <IconButton
            ariaLabel="Check out this post in Hot or Not"
            disabled={!enrolledInHotOrNot}
            href={`/hotornot/${post.publisher_canister_id}@${post.id}`}
            class="rounded-full border-[0.15rem] border-[#FA9301] bg-gradient-to-b from-[#F63700] to-[#FFC848] p-2">
            <FireIcon class="h-5 w-5" />
          </IconButton>
        {/if}
      </div>
    </div>
    {#if $$slots.hotOrNot}
      <div
        style="-webkit-transform: translate3d(0, 0, 0);"
        class="absolute inset-x-0 bottom-0 z-[5] h-40 w-full">
        <slot name="hotOrNot" />
      </div>
    {/if}
  </div>
</player-layout>
