<script lang="ts">
import type { BettingStatus } from '$canisters/individual_user_template/individual_user_template.did'
import Avatar from '$components/avatar/Avatar.svelte'
import IconButton from '$components/button/IconButton.svelte'
import EyeIcon from '$components/icons/EyeIcon.svelte'
import GiftBoxIcon from '$components/icons/GiftBoxIcon.svelte'
import PieChartIcon from '$components/icons/PieChartIcon.svelte'
import ShareMessageIcon from '$components/icons/ShareMessageIcon.svelte'
import TimerIcon from '$components/icons/TimerIcon.svelte'
import UsersIcon from '$components/icons/UsersIcon.svelte'
import HotOrNot from '$components/navigation/HotOrNot.svelte'
import { registerEvent } from '$components/seo/GA.svelte'
import type { IndividualUserActor } from '$lib/helpers/backend'
import getDefaultImageUrl from '$lib/utils/getDefaultImageUrl'
import { generateRandomName } from '$lib/utils/randomUsername'
import userProfile from '$stores/userProfile'
import type { Principal } from '@dfinity/principal'

export let i: number
export let postId: bigint
export let betStatus: BettingStatus | undefined
export let thumbnail = ''
export let displayName = ''
export let profileLink = ''
export let description = ''
export let videoViews = 254000
export let publisherCanisterId: string
export let userProfileSrc = ''
export let createdById = ''
export let individualUser: (
  principal?: Principal | string,
) => IndividualUserActor

let truncate = true
$: bettingAllowed = betStatus && !('BettingClosed' in betStatus)

async function handleShare() {
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: `Check out this hot video by ${displayName}. \n${description}`,
      url: `https://hotornot.wtf/feed/${publisherCanisterId}@${Number(postId)}`,
    })
  } catch (_) {}
  registerEvent('share_video', {
    userId: $userProfile.principal_id,
    video_publisher_id: profileLink,
    video_publisher_canister_id: publisherCanisterId,
    video_id: postId,
  })
  await individualUser(publisherCanisterId).update_post_increment_share_count(
    postId,
  )
}

$: timeLeft = '50m 11s'
$: usersInThisSlot = 48
$: roomNumber = 24
</script>

<player
  {i}
  class="block h-full w-full items-center justify-center overflow-auto transition-all duration-500">
  <slot />
  <img
    alt="background"
    class="absolute inset-0 z-[1] h-full w-full origin-center object-cover blur-xl"
    src={thumbnail} />

  <div
    style="background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%);"
    class="fade-in pointer-events-none absolute bottom-0 z-[10] block h-full w-full">
    <div
      style="-webkit-transform: translate3d(0, 0, 0);"
      class="absolute bottom-40 z-[10] flex w-full space-x-2 px-4">
      <div class="flex grow flex-col space-y-4">
        <div
          on:click={(e) => e.stopImmediatePropagation()}
          class="pointer-events-auto flex space-x-3"
          on:keyup>
          <a href="/profile/{profileLink}" class="h-12 w-12 shrink-0">
            <Avatar
              class="h-12 w-12"
              src={userProfileSrc || getDefaultImageUrl(createdById)} />
          </a>
          <div class="flex flex-col space-y-1">
            <a href="/profile/{profileLink}">
              {displayName || generateRandomName('name', createdById)}
            </a>
            <div class="flex items-center space-x-1">
              <EyeIcon class="h-4 w-4 text-white" />
              <span class="text-sm">{videoViews}</span>
            </div>
          </div>
        </div>
        <button
          class:truncate
          on:click={(e) => {
            e.stopImmediatePropagation()
            truncate = !truncate
          }}
          class="pointer-events-auto w-80 text-left text-sm">
          {description}
        </button>
        <div class:hidden={!bettingAllowed} class="flex items-center space-x-3">
          <div
            class="flex items-center space-x-2 rounded-full bg-black/40 py-2 px-3 text-white">
            <TimerIcon class="h-4 w-4" />
            <span class="text-sm">{timeLeft}</span>
          </div>
          <div
            class="flex items-center space-x-2 rounded-full bg-black/40 py-2 px-3 text-white">
            <UsersIcon class="h-4 w-4" />
            <span class="text-sm">{usersInThisSlot}/100</span>
          </div>
          <div
            class="flex items-center space-x-2 rounded-full bg-black/40 py-2 px-3 text-white">
            <PieChartIcon class="h-4 w-4" />
            <span class="text-sm">{roomNumber}/48</span>
          </div>
        </div>
      </div>
      <div class="max-w-16 flex shrink-0 flex-col space-y-6">
        <IconButton ariaLabel="Share this post" href="/refer-earn">
          <GiftBoxIcon class="h-8 w-8" />
        </IconButton>
        <IconButton
          on:click={(e) => {
            e.stopImmediatePropagation()
            handleShare()
          }}>
          <ShareMessageIcon class="h-6 w-6" />
        </IconButton>
      </div>
    </div>
    {#if betStatus}
      <div
        style="-webkit-transform: translate3d(0, 0, 0);"
        class="absolute inset-x-0 bottom-0 z-[5] h-40 w-full">
        <HotOrNot comingSoon disabled {postId} {betStatus} />
      </div>
    {/if}
  </div>
</player>
