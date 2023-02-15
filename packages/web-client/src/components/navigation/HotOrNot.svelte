<script lang="ts">
import IconButton from '$components/button/IconButton.svelte'
import BetCoinIcon from '$components/icons/BetCoinIcon.svelte'
import ChevronUpIcon from '$components/icons/ChevronUpIcon.svelte'
import HotIcon from '$components/icons/HotIcon.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import NotIcon from '$components/icons/NotIcon.svelte'
import c from 'clsx'

export let tutorialMode = false
export let betPlaced: false | 'hot' | 'not' = false
export let coinsBet = 10

let loading = false
let tempPlacedBet: false | 'hot' | 'not' = false
let error = false

async function placeBet(bet: 'hot' | 'not') {
  try {
    loading = true
    tempPlacedBet = bet
    setTimeout(() => {
      betPlaced = bet
      loading = false
    }, 2000)
  } catch (e) {
    error = true
    setTimeout(() => {
      error = false
    }, 2000)
  }
}

function increaseBet() {
  if (coinsBet == 10) coinsBet = 50
  else if (coinsBet == 50) coinsBet = 100
}

function decreaseBet() {
  if (coinsBet == 50) coinsBet = 10
  else if (coinsBet == 100) coinsBet = 50
}

function toggleBet() {
  if (coinsBet == 100) coinsBet = 10
  else increaseBet()
}
</script>

<hot-or-not
  class="pointer-events-none flex w-full items-center justify-center space-x-8 px-4">
  <div
    class="pointer-events-auto relative flex flex-col items-center space-y-1">
    {#if tutorialMode}
      <div class="absolute -top-2 z-[-1] h-36 w-36 rounded-full bg-white/10" />
    {/if}
    <IconButton
      disabled={tutorialMode}
      on:click={(e) => {
        e.stopImmediatePropagation()
        placeBet('not')
      }}>
      <NotIcon
        class={c('h-24 transition-transform', {
          'scale-110': tempPlacedBet === 'not',
          'scale-90 grayscale': tempPlacedBet === 'hot',
        })} />
    </IconButton>
    <span class="text-sm">Not</span>
  </div>
  <div
    class="relative flex flex-col items-center {tutorialMode
      ? '!pointer-events-none opacity-0'
      : 'pointer-events-auto'}">
    <IconButton
      disabled={coinsBet == 100}
      on:click={(e) => {
        e.stopImmediatePropagation()
        increaseBet()
      }}
      class={c('z-[10] flex items-center p-4 disabled:opacity-50', {
        invisible: betPlaced,
      })}>
      <ChevronUpIcon class="h-2" />
    </IconButton>
    <button
      disabled={betPlaced !== false}
      on:click|stopPropagation={toggleBet}
      class="relative h-20 w-20 select-none">
      <BetCoinIcon class="h-20" />
      <div
        class="absolute inset-0 flex select-none items-center justify-center">
        {#if loading}
          <LoadingIcon class="h-8 w-8 animate-spin" />
        {:else}
          <span
            style="text-shadow: 3px 3px 0 #EA9C00;"
            class="select-none text-3xl font-extrabold text-[#FFCC00]">
            {coinsBet}
          </span>
        {/if}
      </div>
    </button>
    <IconButton
      on:click={(e) => {
        e.stopImmediatePropagation()
        decreaseBet()
      }}
      disabled={coinsBet == 10}
      class={c('z-[10] flex items-center p-4 disabled:opacity-50', {
        invisible: betPlaced,
      })}>
      <ChevronUpIcon class="h-2 rotate-180" />
    </IconButton>
  </div>
  <div
    class="pointer-events-auto relative flex flex-col items-center space-y-1">
    {#if tutorialMode}
      <div class="absolute -top-2 z-[-1] h-36 w-36 rounded-full bg-white/10" />
    {/if}
    <IconButton
      disabled={tutorialMode}
      on:click={(e) => {
        e.stopImmediatePropagation()
        placeBet('hot')
        betPlaced = 'hot'
      }}>
      <HotIcon
        class={c('h-24 transition-transform', {
          'scale-110': tempPlacedBet === 'hot',
          'scale-90 grayscale': tempPlacedBet === 'not',
        })} />
    </IconButton>
    <span class="text-sm">Hot</span>
  </div>
  {#if error}
    <div
      class="absolute bottom-16 -translate-x-3 rounded-md bg-white p-4 text-sm text-black drop-shadow-md">
      Something went wrong! Please try again.
    </div>
  {/if}
</hot-or-not>
