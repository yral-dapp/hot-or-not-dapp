<script lang="ts">
import LoginButton from '$components/auth/LoginButton.svelte'
import Icon from '$components/icon/Icon.svelte'
import { getDb } from '$lib/db'
import type { CollectionName, VoteRecord } from '$lib/db/db.types'
import { authState } from '$stores/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { onMount, tick } from 'svelte'
import { fade } from 'svelte/transition'
import ResultCard from './ResultCard.svelte'

let votes: VoteRecord[] = []
let loading = true

async function getVotes() {
  try {
    await tick()
    if (!$authState.userId) return
    const db = getDb()
    const coll = collection(db, 'votes' as CollectionName)

    const votesDocs = await getDocs(
      query(coll, where('uid', '==', $authState.userId)),
    )
    votesDocs.forEach((doc) => votes.push(doc.data() as VoteRecord))
  } catch (e) {
    console.error('Error loading votes', e)
  } finally {
    loading = false
  }
}

onMount(() => {
  getVotes()
})
</script>

<div transition:fade class="mt-20 h-full w-full bg-black px-4 py-2">
  {#if loading}
    <div class="mt-20 flex w-full flex-col items-center justify-center gap-2">
      <Icon name="loading" class="h-4 w-4 animate-spin-slow" />
      <span>Loading ...</span>
    </div>
  {:else if $authState.isLoggedIn}
    {#if votes.length}
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {#each votes as vote}
          <ResultCard {vote} />
        {/each}
      </div>
    {:else}
      <div
        class="mt-24 flex w-full grow flex-col items-center justify-center gap-2">
        <Icon name="transactions-graphic" class="w-full max-w-sm px-10" />
        <div class="pt-4 text-center opacity-70">No transactions yet</div>
      </div>
    {/if}
  {:else}
    <div
      class="mt-24 flex w-full grow flex-col items-center justify-center gap-2">
      <LoginButton />
    </div>
  {/if}
</div>
