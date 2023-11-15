<script lang="ts">
import Icon from '$components/icon/Icon.svelte'
import { createEventDispatcher } from 'svelte'
import type { UpDownVoteDetails } from './UpDownVote.svelte'
import { authState } from '$stores/auth'
import c from 'clsx'

export let score: number
export let disabled = false
export let tutorialStep: number | undefined = undefined

const dispatch = createEventDispatcher<{
  votePlaced: UpDownVoteDetails
}>()

let selectedAmount = 50
let vote: {
  direction?: 'up' | 'down'
  loading: boolean
  voteAmount?: number
} = {
  loading: false,
}

function placeVote(direction: 'up' | 'down', voteAmount: number) {
  if (vote.loading) return
  if (!$authState.isLoggedIn) {
    $authState.showLogin = true
    return
  }
  vote.direction = direction
  vote.loading = true
  vote.voteAmount = voteAmount

  dispatch('votePlaced', {
    direction,
    voteAmount,
    status: 'pending',
    created_at: Date.now(),
  })
}
</script>

<div
  class={c(
    'flex flex-col items-center justify-center gap-3 pt-4 transition-opacity',
    disabled || tutorialStep ? 'pointer-events-none' : 'pointer-events-auto',
    {
      'opacity-50': disabled,
    },
  )}>
  <div
    class={c(
      'mx-8 flex items-center justify-between gap-1 rounded-xl bg-black/30 p-1',
      {
        'opacity-30': tutorialStep && tutorialStep !== 3,
      },
    )}>
    <button
      disabled={vote.loading || !!tutorialStep}
      on:click={(e) => (selectedAmount = 10)}
      class:bg-primary={selectedAmount === 10}
      class="flex flex-nowrap items-center gap-1 rounded-lg p-3">
      <Icon name="coin-token" class="h-4 w-4" />
      <div class="whitespace-nowrap text-xs">10 Tokens</div>
    </button>
    <button
      disabled={vote.loading || !!tutorialStep}
      on:click={() => (selectedAmount = 50)}
      class:bg-primary={selectedAmount === 50}
      class="flex flex-nowrap items-center gap-1 rounded-lg p-3">
      <Icon name="coin-token" class="h-4 w-4" />
      <div class="whitespace-nowrap text-xs">50 Tokens</div>
    </button>
    <button
      disabled={vote.loading || !!tutorialStep}
      on:click={() => (selectedAmount = 100)}
      class:bg-primary={selectedAmount === 100}
      class="flex flex-nowrap items-center gap-1 rounded-lg p-3">
      <Icon name="coin-token" class="h-4 w-4" />
      <div class="whitespace-nowrap text-xs">100 Tokens</div>
    </button>
  </div>
  <div class="flex items-center justify-between gap-4 px-4">
    <button
      disabled={vote.loading || !!tutorialStep}
      on:click={() => placeVote('down', selectedAmount)}
      class={c(
        'flex w-24 flex-col items-center justify-center gap-1 self-stretch rounded-md bg-red-500',
        {
          'opacity-30':
            tutorialStep === 2 || tutorialStep == 3 || tutorialStep === 5,
          'grayscale': vote.loading && vote.direction === 'up',
        },
      )}>
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
    <div
      class={c('flex flex-col items-center justify-center', {
        'opacity-30':
          tutorialStep === 3 || tutorialStep == 4 || tutorialStep === 5,
      })}>
      <div
        class="text-5xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        {Math.round(score)}
      </div>
      <div class="text-sm drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        Current scrore
      </div>
    </div>
    <button
      disabled={vote.loading || !!tutorialStep}
      on:click={() => placeVote('up', selectedAmount)}
      class={c(
        'flex w-24 flex-col items-center justify-center gap-1 self-stretch rounded-md bg-green-500 py-3',
        {
          'opacity-30':
            tutorialStep === 2 || tutorialStep == 3 || tutorialStep === 5,
          'grayscale': vote.loading && vote.direction === 'down',
        },
      )}>
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
