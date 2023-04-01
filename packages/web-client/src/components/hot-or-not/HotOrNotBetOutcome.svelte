<script lang="ts" context="module">
type UnionKeyOf<U> = U extends U ? keyof U : never
type BetOutcome = UnionKeyOf<BetOutcomeForBetMaker>
type BetType = UnionKeyOf<BetDirection>

function getBetStatus(outcome: BetOutcomeForBetMaker): BetOutcome {
  return Object.keys(outcome)[0] as BetOutcome
}

function getBetDirection(direction: BetDirection): BetType {
  return Object.keys(direction)[0] as BetType
}
</script>

<script lang="ts">
import type {
  BetDirection,
  BetOutcomeForBetMaker,
  BettingStatus,
  PlacedBetDetail,
  SystemTime,
} from '$canisters/individual_user_template/individual_user_template.did'
import BetCoinIcon from '$components/icons/BetCoinIcon.svelte'
import HotIcon from '$components/icons/HotIcon.svelte'
import NotIcon from '$components/icons/NotIcon.svelte'
import { fade } from 'svelte/transition'
import c from 'clsx'
import TimerIcon from '$components/icons/TimerIcon.svelte'
import { getMsLeftForBetResult } from '$lib/utils/timeLeft'
import type { Readable } from 'svelte/store'

export let placedBetDetail: PlacedBetDetail | undefined = undefined
export let postCreatedAt: SystemTime | undefined = undefined

let betOutcome: BetOutcome = 'AwaitingResult'
let betDirection: BetType = 'Hot'
let amountBet: number = 10
let timeLeft: Readable<string>

$: if (placedBetDetail) {
  betOutcome = getBetStatus(placedBetDetail.outcome_received)
  betDirection = getBetDirection(placedBetDetail.bet_direction)
  amountBet = Number(placedBetDetail.amount_bet)
  if (postCreatedAt) {
    timeLeft = getMsLeftForBetResult(placedBetDetail.slot_id, postCreatedAt)
  }
}
</script>

<div
  transition:fade|local
  class="flex h-full w-full items-center space-x-8 px-4">
  <div
    class={c('flex items-center', {
      'translate-y-4 -space-x-8 -space-y-8': betOutcome !== 'AwaitingResult',
      'space-x-2': betOutcome === 'AwaitingResult',
    })}>
    <div class="z-[2] shrink-0">
      {#if betDirection === 'Hot'}
        <HotIcon class="h-16" />
      {:else if betDirection === 'Not'}
        <NotIcon class="h-16" />
      {/if}
    </div>
    <div class="relative z-[1] h-16 w-16 shrink-0">
      <BetCoinIcon class="h-16" />
      <span
        style="text-shadow: 3px 3px 0 #EA9C00;"
        class="absolute inset-0 flex select-none items-center justify-center text-2xl font-extrabold text-[#ffeea8]">
        {amountBet}
      </span>
    </div>
  </div>
  {#if betOutcome === 'AwaitingResult'}
    <div class="flex shrink-0 grow flex-col space-y-2">
      <span class="text-sm">
        You staked <strong>{amountBet}</strong>
        tokens on
        <strong>{betDirection}.</strong>
        Result is still pending.
      </span>
      {#if timeLeft}
        <div
          class="flex grow items-center justify-center space-x-2 rounded-full bg-primary px-3 py-2 shadow-button-primary">
          <TimerIcon class="h-5 w-5" />
          <span class="font-bold text-white">{$timeLeft}</span>
        </div>
      {/if}
    </div>
  {:else}
    {@const outcomeAmount =
      Number(Object.values(placedBetDetail?.outcome_received || {})?.[0]) || 0}
    <div class="flex shrink-0 grow flex-col space-y-2">
      <span class="text-sm">
        You staked <strong>{amountBet}</strong>
        tokens on
        <strong>{betDirection}.</strong>

        {#if betOutcome === 'Won' && outcomeAmount}
          You received <strong>{outcomeAmount}</strong>
          tokens.
        {/if}
        {#if betOutcome === 'Lost'}
          You lost {amountBet} tokens.
        {/if}
        {#if betOutcome === 'Draw' && outcomeAmount}
          You got refunded <strong>{outcomeAmount}</strong>
          tokens after deducting commission.
        {/if}
      </span>
      <div
        class={c(
          'flex grow items-center justify-center space-x-2 rounded-full px-3 py-2',
          {
            'bg-green-500': betOutcome === 'Won',
            'bg-red-500': betOutcome === 'Lost',
            'bg-gray-600': betOutcome === 'Draw',
          },
        )}>
        <span class="font-bold text-white">
          {betOutcome != 'Draw' ? 'You' : ''}
          {betOutcome}
        </span>
      </div>
    </div>
  {/if}
</div>
