<script lang="ts">
import LoginButton from '$components/auth/LoginButton.svelte'
import Avatar from '$components/avatar/Avatar.svelte'
import Icon from '$components/icon/Icon.svelte'
import { getDb } from '$lib/db'
import type { CollectionName, VoteRecord } from '$lib/db/db.types'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import { pluralize } from '$lib/utils/pluralize'
import { authState } from '$stores/auth'
import userProfile from '$stores/userProfile'
import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import { onMount, tick } from 'svelte'
import { fade } from 'svelte/transition'

let votes: VoteRecord[] = []
let loading = true

async function getVotes() {
  try {
    await tick()
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
          <a
            href="/up-down/{vote.videoUoid}@{vote.videoOid}"
            data-sveltekit-preload-code="eager"
            class="relative aspect-[3/5] w-full cursor-pointer overflow-hidden rounded-md bg-cover">
            <div
              class="absolute inset-0 scale-110 bg-cover bg-center"
              style="background-image: url('{getThumbnailUrl(
                vote.videoUid,
              )}')" />
            <div
              style="background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%);"
              class="pointer-events-none absolute inset-0 z-[2] flex flex-col justify-between p-2 md:p-4">
              <div class="flex items-center space-x-2">
                <Avatar class="h-6 w-6" src={$userProfile.photoUrl} />
                <div class="text-xs font-semibold sm:text-sm">
                  {$userProfile.name}
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-thin uppercase">
                  {vote.voteDirection} from {vote.currentScore}
                </span>
                <span class="pb-2 text-sm font-bold md:text-lg">
                  {vote.voteAmount}
                  {pluralize('Token', vote.voteAmount)}
                </span>

                <div
                  class="flex w-full items-center justify-center space-x-1 rounded-full bg-orange-500 py-1 text-sm text-white md:py-2">
                  <Icon name="stopwatch" class="h-5 w-5" />
                  <span>30:00</span>
                </div>
              </div>
            </div>
          </a>
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
