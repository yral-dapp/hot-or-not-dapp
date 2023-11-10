<script lang="ts">
import Icon from '$components/icon/Icon.svelte'
import type { CollectionName, UpDownPost, VoteRecord } from '$lib/db/db.types'
import { getMsLeftForResult, getVoteEndTime } from '$lib/utils/countdown'
import type { UpDownVoteDetails } from './UpDownVote.svelte'
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { onDestroy } from 'svelte'
import { getDb } from '$lib/db'

export let voteDetails: UpDownVoteDetails
export let voteDocId: string | undefined = undefined
export let post: UpDownPost
export let disabled = false

const endTime = getVoteEndTime(new Date(post.created_at), new Date())
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
      voteDetails = {
        direction: data.voteDirection,
        created_at: data.created_at,
        status: data.status,
        result: data.result,
        voteAmount: data.voteAmount,
      }
    })
  } catch (e) {
    console.log('error while observing vote', e)
  }
}
</script>

<div
  class="flex items-center justify-center gap-4 px-4 pt-10 transition-opacity
  {disabled ? 'pointer-events-none opacity-50' : 'pointer-events-auto'}">
  <div
    class="flex w-24 flex-col items-center justify-center gap-1 rounded-md py-4
    {voteDetails.direction === 'up' ? 'bg-green-500' : 'bg-red-500'}">
    <div
      class="flex h-5 w-5 items-center justify-center rounded-full bg-white
      {voteDetails.direction === 'up' ? 'text-green-500' : 'text-red-500'}">
      <Icon
        name="arrow-up"
        class="h-5 w-5 {voteDetails.direction === 'up' ? '' : 'rotate-180'}" />
    </div>
    <div class="text-sm capitalize">{voteDetails.direction}</div>
  </div>
  <div class="relative h-20 w-20 select-none">
    <Icon name="coin-face" class="h-20 w-20" />
    <div class="absolute inset-0 flex select-none items-center justify-center">
      <span
        style="text-shadow: 3px 3px 0 #EA9C00;"
        class="select-none text-3xl font-extrabold text-[#FFCC00]">
        {voteDetails.voteAmount}
      </span>
    </div>
  </div>
  {#if $timeLeft}
    <div class="flex grow flex-col items-center justify-center gap-1">
      <div
        class="flex w-full items-center justify-center space-x-2 rounded-full bg-primary px-3 py-2 shadow-button-primary">
        <Icon name="stopwatch" class="h-5 w-5" />
        <span class="font-bold text-white">{$timeLeft}</span>
      </div>
      <div class="text-xs text-white">Your vote has been placed</div>
    </div>
  {/if}
</div>
