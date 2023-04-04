<script lang="ts" context="module">
import type { BetDirection } from '$canisters/individual_user_template/individual_user_template.did'

type UnionKeyOf<U> = U extends U ? keyof U : never
export type BetDirectionString = UnionKeyOf<BetDirection>

export type PlaceBet = {
  coins: number
  direction: BetDirectionString
}
</script>

<script lang="ts">
import IconButton from '$components/button/IconButton.svelte'
import BetCoinIcon from '$components/icons/BetCoinIcon.svelte'
import ChevronUpIcon from '$components/icons/ChevronUpIcon.svelte'
import HotIcon from '$components/icons/HotIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import NotIcon from '$components/icons/NotIcon.svelte'
import { playerState } from '$stores/playerState'
import c from 'clsx'
import { createEventDispatcher } from 'svelte'
import { fade } from 'svelte/transition'

export let tutorialMode = false
export let loadingWithDirection: false | BetDirectionString = false
export let disabled = false
export let error = ''
export let betPlaced: false | BetDirectionString = false

const dispatch = createEventDispatcher<{
  placeBet: PlaceBet
}>()

function increaseBet() {
  if ($playerState.selectedCoins == 10) $playerState.selectedCoins = 50
  else if ($playerState.selectedCoins == 50) $playerState.selectedCoins = 100
}

function decreaseBet() {
  if ($playerState.selectedCoins == 50) $playerState.selectedCoins = 10
  else if ($playerState.selectedCoins == 100) $playerState.selectedCoins = 50
}

function toggleBet() {
  if ($playerState.selectedCoins == 100) $playerState.selectedCoins = 10
  else increaseBet()
}

function placeBet(direction: 'Hot' | 'Not') {
  dispatch('placeBet', {
    direction,
    coins: $playerState.selectedCoins,
  })
}
</script>

<div
  class="pointer-events-none absolute inset-0 top-0 flex items-center justify-center space-x-8 px-4"
  transition:fade|local>
  <div
    class={c(
      'relative flex flex-col items-center space-y-1',
      error ? 'pointer-events-none' : 'pointer-events-auto',
    )}>
    {#if tutorialMode}
      <div class="absolute -top-2 z-[-1] h-36 w-36 rounded-full bg-white/10" />
    {/if}
    <IconButton
      disabled={tutorialMode || disabled}
      on:click={(e) => {
        e.stopImmediatePropagation()
        placeBet('Not')
      }}>
      <NotIcon
        class={c('h-24 transition-transform', {
          'scale-110': loadingWithDirection === 'Not',
          'scale-90 grayscale': loadingWithDirection === 'Hot',
        })} />
    </IconButton>
    <span class="text-sm">Not</span>
  </div>
  <div
    class={c(
      'relative flex flex-col items-center',
      tutorialMode || error ? '!pointer-events-none' : 'pointer-events-auto',
      {
        'opacity-0': tutorialMode,
      },
    )}>
    <IconButton
      disabled={$playerState.selectedCoins == 100 || disabled}
      on:click={(e) => {
        e.stopImmediatePropagation()
        increaseBet()
      }}
      class={c('z-[10] flex items-center p-4 disabled:opacity-50', {
        invisible: betPlaced || loadingWithDirection,
      })}>
      <ChevronUpIcon class="h-2" />
    </IconButton>
    <button
      disabled={betPlaced !== false ||
        loadingWithDirection !== false ||
        disabled}
      on:click|stopPropagation={toggleBet}
      class="relative h-20 w-20 select-none disabled:grayscale">
      <BetCoinIcon class="h-20" />
      <div
        class="absolute inset-0 flex select-none items-center justify-center">
        {#if loadingWithDirection}
          <LoadingIcon class="h-8 w-8 animate-spin" />
        {:else}
          <span
            style="text-shadow: 3px 3px 0 #EA9C00;"
            class="select-none text-3xl font-extrabold text-[#FFCC00]">
            {$playerState.selectedCoins}
          </span>
        {/if}
      </div>
    </button>
    <IconButton
      on:click={(e) => {
        e.stopImmediatePropagation()
        decreaseBet()
      }}
      disabled={$playerState.selectedCoins == 10 || disabled}
      class={c('z-[10] flex items-center p-4 disabled:opacity-50', {
        invisible: betPlaced || loadingWithDirection,
      })}>
      <ChevronUpIcon class="h-2 rotate-180" />
    </IconButton>
  </div>
  <div
    class="relative flex flex-col items-center space-y-1 {error
      ? 'pointer-events-none'
      : 'pointer-events-auto'}">
    {#if tutorialMode}
      <div class="absolute -top-2 z-[-1] h-36 w-36 rounded-full bg-white/10" />
    {/if}
    <IconButton
      disabled={tutorialMode || disabled}
      on:click={(e) => {
        e.stopImmediatePropagation()
        placeBet('Hot')
      }}>
      <HotIcon
        class={c('h-24 transition-transform', {
          'scale-110': loadingWithDirection === 'Hot',
          'scale-90 grayscale': loadingWithDirection === 'Not',
        })} />
    </IconButton>
    <span class="text-sm">Hot</span>
  </div>
</div>
