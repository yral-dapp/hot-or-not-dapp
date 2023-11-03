<script lang="ts">
import Icon from '$components/icon/Icon.svelte'
import { createEventDispatcher } from 'svelte'
import type { UpDownVoteDetails } from './UpDownVote.svelte'

export let score: number

const dispatch = createEventDispatcher<{
  votePlaced: UpDownVoteDetails
}>()

let selectedCoins = 50
let vote: {
  direction?: 'up' | 'down'
  loading: boolean
  coins?: number
} = {
  loading: false,
}

function placeVote(direction: 'up' | 'down', coins: number) {
  if (vote.loading) return
  vote.direction = direction
  vote.loading = true
  vote.coins = coins

  setTimeout(() => {
    dispatch('votePlaced', {
      direction,
      coins,
      result: 'pending',
      placed_at: Date.now(),
    })
  }, 2000)
}
</script>

<div
  class="pointer-events-auto flex flex-col items-center justify-center gap-3 pt-4">
  <div
    class="mx-8 flex items-center justify-between gap-1 rounded-xl bg-black/30 p-1">
    <button
      disabled={vote.loading}
      on:click={(e) => (selectedCoins = 10)}
      class:bg-primary={selectedCoins === 10}
      class="flex flex-nowrap items-center gap-1 rounded-lg p-3">
      <Icon name="coin-dollar" class="h-4 w-4" />
      <div class="whitespace-nowrap text-xs">10 COYNs</div>
    </button>
    <button
      disabled={vote.loading}
      on:click={() => (selectedCoins = 50)}
      class:bg-primary={selectedCoins === 50}
      class="flex flex-nowrap items-center gap-1 rounded-lg p-3">
      <Icon name="coin-dollar" class="h-4 w-4" />
      <div class="whitespace-nowrap text-xs">50 COYNs</div>
    </button>
    <button
      disabled={vote.loading}
      on:click={() => (selectedCoins = 100)}
      class:bg-primary={selectedCoins === 100}
      class="flex flex-nowrap items-center gap-1 rounded-lg p-3">
      <Icon name="coin-dollar" class="h-4 w-4" />
      <div class="whitespace-nowrap text-xs">100 COYNs</div>
    </button>
  </div>
  <div class="flex items-center justify-between gap-4 px-4">
    <button
      disabled={vote.loading}
      on:click={() => placeVote('down', selectedCoins)}
      class="flex w-24 flex-col items-center justify-center gap-1 self-stretch rounded-md bg-red-500">
      {#if vote.loading && vote.direction === 'down'}
        <Icon name="loading" class="h-8 w-8 animate-spin-slow text-white" />
      {:else}
        <div
          class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-red-500">
          <Icon name="arrow-up" class="h-5 w-5 rotate-180" />
        </div>
        <div class="text-sm">Down</div>
      {/if}
    </button>
    <div class="flex flex-col items-center justify-center">
      <div
        class="text-5xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        {score}
      </div>
      <div class="text-sm drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        Current scrore
      </div>
    </div>
    <button
      disabled={vote.loading}
      on:click={() => placeVote('up', selectedCoins)}
      class="flex w-24 flex-col items-center justify-center gap-1 self-stretch rounded-md bg-green-500 py-3">
      {#if vote.loading && vote.direction === 'up'}
        <Icon name="loading" class="h-8 w-8 animate-spin-slow text-white" />
      {:else}
        <div
          class="self-str flex h-5 w-5 items-center justify-center rounded-full bg-white text-green-500">
          <Icon name="arrow-up" class="h-5 w-5" />
        </div>
        <div class="text-sm">Up</div>
      {/if}
    </button>
  </div>
</div>
