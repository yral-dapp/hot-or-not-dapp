<script lang="ts">
import ArrowUpIcon from '$components/icons/ArrowUpIcon.svelte'
import ExternalLinkIcon from '$components/icons/ExternalLinkIcon.svelte'
import type { TransactionHistory } from '$lib/helpers/profile'

export let item: TransactionHistory

$: deducted =
  item.type === 'Burn' || item.type === 'Stake' || item.type === 'Transfer'
$: eventName = item.subType?.replace(/([A-Z])/g, ' $1').trim() || ''
//@ts-ignore
$: postCanisterId = item.details?.post_canister_id?.toText() || ''
//@ts-ignore
$: postId = Number(item.details?.post_id) || 0
</script>

<div class="flex items-center justify-between py-4">
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
    <div class="flex flex-col space-y-1">
      <div class="text-sm">{eventName}</div>

      {#if (item.subType === 'BetOnHotOrNotPost' || item.subType === 'WinningsEarnedFromBet' || item.subType === 'CommissionFromHotOrNotBet') && postCanisterId}
        <a
          href="/hotornot/{postCanisterId}@{postId}"
          class="flex w-min items-center space-x-1 text-white underline opacity-50">
          <span class="whitespace-nowrap text-xs">View Post</span>
          <ExternalLinkIcon class="h-3 w-3" />
        </a>
      {:else}
        <div class="text-xs opacity-50">{item.token} Coins</div>
      {/if}
    </div>
  </div>
  <div class="text-sm {deducted ? 'text-red-600' : 'text-green-600'}">
    {deducted ? '-' : '+'}
    {item.token}
  </div>
</div>
