<script lang="ts">
import ArrowUpIcon from '$components/icons/ArrowUpIcon.svelte'
import type {
  TransactionHistory,
  WalletEventSubType,
} from '$lib/helpers/profile'
import getTimeDifference from '$lib/utils/getTimeDifference'
import { authState } from '$stores/auth'
import userProfile from '$stores/userProfile'

export let item: TransactionHistory

function getEventName() {
  switch (item.eventOutcome) {
    case 'Draw':
      return 'Draw outcome'
    case 'Lost':
      return 'Lost outcome'
    case 'Won':
      return 'Won outcome'
    default:
      return labels[item.subType]?.replace(/([A-Z])/g, ' $1').trim() || ''
  }
}

$: deducted =
  item.type === 'Burn' || item.type === 'Stake' || item.type === 'Transfer'
$: eventName = getEventName()
//@ts-ignore
$: postCanisterId = item.details?.post_canister_id?.toText() || ''
//@ts-ignore
$: postId = Number(item.details?.post_id) || 0
$: userId = $userProfile.username_set
  ? $userProfile.unique_user_name || $authState.idString
  : $authState.idString
$: timeDiff = getTimeDifference(Number(item.timestamp.secs_since_epoch) * 1000)
$: href =
  item.subType === 'CommissionFromHotOrNotBet'
    ? `/hotornot/${userId}/${postId}`
    : `/profile/${userId}/speculations/${postCanisterId}@${postId}`
$: hrefTypeEl =
  (item.subType === 'BetOnHotOrNotPost' ||
    item.subType === 'WinningsEarnedFromBet' ||
    item.subType === 'CommissionFromHotOrNotBet') &&
  postCanisterId

const labels: Record<WalletEventSubType, string> = {
  BetOnHotOrNotPost: 'VotedOnHotOrNotPost',
  CommissionFromHotOrNotBet: 'CommissionFromPostVote',
  WinningsEarnedFromBet: 'WinningsEarnedFromVoting',
  NewUserSignup: 'NewUserSignup',
  Referral: 'Referral',
}
</script>

<svelte:element
  this={hrefTypeEl ? 'a' : 'div'}
  {href}
  class="flex items-center justify-between py-4">
  <div class="flex items-center space-x-4">
    <div
      class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-2">
      <div
        class="flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-transparent">
        {#if deducted}
          <ArrowUpIcon class="h-6 w-6" />
        {:else}
          <ArrowUpIcon class="h-6 w-6 rotate-180" />
        {/if}
      </div>
    </div>
    <div class="flex flex-col">
      <div class="text-sm">{eventName}</div>
      <div class="flex items-center space-x-1 text-xs text-white/50">
        {#if hrefTypeEl}
          <span class="whitespace-nowrap underline">View Post</span>
        {:else}
          <span>{item.token} Coins</span>
        {/if}
        <span>•</span>
        <span>{timeDiff}</span>
      </div>
    </div>
  </div>
  {#if item.eventOutcome !== 'Lost'}
    <div
      class="shrink-0 text-sm {deducted ? 'text-red-600' : 'text-green-600'}">
      {item.eventOutcome === 'Draw' ? '←' : deducted ? '-' : '+'}
      {item.token}
    </div>
  {/if}
</svelte:element>
