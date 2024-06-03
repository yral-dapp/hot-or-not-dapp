<script lang="ts">
import Icon from '@hnn/components/icon/Icon.svelte'
import type { TransactionHistory, WalletEventType } from '$lib/helpers/profile'
import getTimeDifference from '$lib/utils/getTimeDifference'
import { authState } from '$lib/stores/auth'
import { userProfile } from '$lib/stores/app'

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
$: timeDiff = getTimeDifference(Number(item.timestamp.secs_since_epoch) * 1000)

const labels: Record<WalletEventType, string> = {
  BetOnHotOrNotPost: 'VotedOnHotOrNotPost',
  CommissionFromHotOrNotBet: 'CommissionFromPostVote',
  WinningsEarnedFromBet: 'WinningsEarnedFromVoting',
  NewUserSignup: 'NewUserSignup',
  Referral: 'Referral',
}
</script>

<svelte:element this="div" class="flex items-center justify-between py-4">
  <div class="flex items-center space-x-4">
    <div
      class="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-2">
      <div
        class="flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-transparent">
        <Icon name="arrow-up" class="h-6 w-6 {deducted ? '' : 'rotate-180'}" />
      </div>
    </div>
    <div class="flex flex-col">
      <div class="text-sm">{eventName}</div>
      <div class="flex items-center space-x-1 text-xs text-white/50">
        <span>{item.token} Coins</span>
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
