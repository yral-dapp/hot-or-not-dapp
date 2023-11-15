<script lang="ts">
import Icon from '$components/icon/Icon.svelte'
import type { CollectionName, UpDownPost, VoteRecord } from '$lib/db/db.types'
import { getMsLeftForResult, getVoteEndTime } from '$lib/utils/countdown'
import type { UpDownVoteDetails } from './UpDownVote.svelte'
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { onDestroy } from 'svelte'
import { getDb } from '$lib/db'
import { writable } from 'svelte/store'

export let voteDetails: UpDownVoteDetails
export let voteDocId: string | undefined = undefined
export let post: UpDownPost
export let disabled = false

let voteDetailsStore = writable<UpDownVoteDetails>(voteDetails)

const endTime = getVoteEndTime(
  new Date(post.created_at),
  new Date(voteDetails.created_at),
)

let timeLeft = getMsLeftForResult(endTime)
let unsubscribe: Unsubscribe | undefined = undefined

onDestroy(() => unsubscribe?.())

$: if (voteDocId) {
  observeDoc()
}

async function observeDoc() {
  try {
    if (unsubscribe || !voteDocId) return
    const db = getDb()
    const docRef = doc(db, 'votes' as CollectionName, voteDocId)
    unsubscribe = onSnapshot(docRef, (doc) => {
      const data = doc.data() as VoteRecord
      $voteDetailsStore = {
        direction: data.voteDirection,
        created_at: data.created_at,
        status: data.status,
        score: data.currentScore,
        result: data.result,
        voteAmount: data.voteAmount,
      }
    })
  } catch (e) {
    console.log('error while observing vote', e)
  }
}

$: console.log({ voteDetails })
</script>

<div
  class:opacity-50={disabled}
  class="pointer-events-none flex w-full flex-col items-center justify-center gap-2 p-3 transition-opacity">
  <div
    class="mx-8 flex items-center justify-between gap-1 rounded-xl bg-black/30 p-1">
    <div
      class:bg-zinc-500={$voteDetailsStore.voteAmount === 10}
      class="flex flex-nowrap items-center gap-1 rounded-lg p-3">
      <Icon name="coin-token" class="h-4 w-4" />
      <div class="whitespace-nowrap text-xs">10 Tokens</div>
    </div>
    <div
      class:bg-zinc-500={$voteDetailsStore.voteAmount === 50}
      class="flex flex-nowrap items-center gap-1 rounded-lg p-3">
      <Icon name="coin-token" class="h-4 w-4" />
      <div class="whitespace-nowrap text-xs">50 Tokens</div>
    </div>
    <div
      class:bg-zinc-500={$voteDetailsStore.voteAmount === 100}
      class="flex flex-nowrap items-center gap-1 rounded-lg p-3">
      <Icon name="coin-token" class="h-4 w-4" />
      <div class="whitespace-nowrap text-xs">100 Tokens</div>
    </div>
  </div>
  <div class="flex w-full items-center gap-8 px-8">
    <div class="relative flex shrink-0 flex-col items-center justify-center">
      <div
        class="text-5xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        {Math.round($voteDetailsStore.score)}
      </div>
      <div class="text-sm drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        Score
      </div>
      <div
        class="absolute -left-6 -top-3 flex h-8 w-8 items-center justify-center rounded-full
        {$voteDetailsStore.direction === 'down'
          ? 'bg-red-500'
          : 'bg-green-500'}">
        <Icon
          name="arrow-up"
          class="h-6 w-6 
          {$voteDetailsStore.direction === 'down' ? 'rotate-180' : ''}" />
      </div>
    </div>

    {#if $voteDetailsStore.status === 'final'}
      <div
        class="flex w-full items-center justify-center space-x-2 rounded-full px-3 py-2 shadow-button-primary
    {$voteDetailsStore.result?.status === 'won'
          ? 'bg-green-500'
          : 'bg-red-500'}">
        {#if $voteDetailsStore.result?.status === 'won'}
          You won {$voteDetailsStore.result?.won_amount
            ? `${$voteDetailsStore.result.won_amount} tokens`
            : ''}
        {:else}
          You lost
        {/if}
      </div>
    {:else if $timeLeft}
      <div class="flex flex-1 flex-col items-center justify-center gap-1">
        <div
          class="flex w-full items-center justify-center space-x-2 rounded-full bg-primary px-3 py-2 shadow-button-primary">
          <Icon name="stopwatch" class="h-5 w-5" />
          <span
            class:loading={$timeLeft === '...'}
            class="font-bold text-white">
            {#if $timeLeft === '...'}
              Loading ...
            {:else}
              {$timeLeft}
            {/if}
          </span>
        </div>

        <div class:loading={$timeLeft === '...'} class="text-xs text-white">
          {#if $timeLeft === '...'}
            Processing vote result ...
          {:else}
            Your vote has been placed
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
