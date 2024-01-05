<script lang="ts">
import Icon from '@hnn/components/icon/Icon.svelte'
import type { NotificationHistory } from '$lib/helpers/profile'
import getTimeDifference from '$lib/utils/getTimeDifference'
import { authState } from '$lib/stores/auth'
import { userProfile } from '$lib/stores/app'
import c from 'clsx'

export let item: NotificationHistory

function getNotificationMessage(item: NotificationHistory) {
  switch (item.type) {
    case 'CommissionFromHotOrNotBet': {
      return `Congratulations! You've earned ${item.token} tokens from commissions on your video.`
    }
    case 'Referral': {
      return `Congratulations! A user joined Hot or Not, you have received ${item.token} tokens for referring user.`
    }
    case 'WinningsEarnedFromBet': {
      switch (item.eventOutcome) {
        case 'Draw':
          return 'The Result was a draw on a video you voted on'
        case 'Lost':
          return `You lost on a video you voted on`
        case 'Won':
          return `Congratulations! You won ${item.token} tokens on a video you voted on.`
      }
    }
  }
}

$: deducted =
  item.type === 'Burn' || item.type === 'Stake' || item.type === 'Transfer'
//@ts-ignore
$: postCanisterId = item.details?.post_canister_id?.toText() || ''
//@ts-ignore
$: postId = Number(item.details?.post_id) || 0
$: userId = $userProfile.username_set
  ? $userProfile.unique_user_name || $authState.idString
  : $authState.idString
$: timeDiff = getTimeDifference(
  Number(item.timestamp.secs_since_epoch) * 1000,
  { showTime: true },
)
</script>

<div class="flex items-center justify-between py-4">
  <div class="flex items-center space-x-4">
    <div
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 p-2">
      {#if item.type === 'WinningsEarnedFromBet'}
        <div
          class={c('text-primary', {
            'grayscale': item.eventOutcome === 'Draw',
            '-rotate-[60deg]': item.eventOutcome === 'Lost',
          })}>
          <Icon name="trophy-fill" class="h-5 w-5" />
        </div>
      {:else}
        <div
          class="flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-transparent">
          <Icon
            name="arrow-up"
            class="h-6 w-6 {deducted ? '' : 'rotate-180'}" />
        </div>
      {/if}
    </div>
    <div class="flex flex-col text-sm text-white">
      {#if (item.type === 'WinningsEarnedFromBet' || item.type === 'CommissionFromHotOrNotBet') && postCanisterId}
        <a
          href="/profile/{userId}/speculations/{postCanisterId}@{postId}"
          class="">
          {getNotificationMessage(item)}
        </a>
      {:else}
        <div>{getNotificationMessage(item)}</div>
      {/if}
      <span class="text-xs text-white/50">{timeDiff}</span>
    </div>
  </div>
</div>
