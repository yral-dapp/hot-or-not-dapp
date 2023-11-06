<script lang="ts">
import Avatar from '$components/avatar/Avatar.svelte'
import Icon from '$components/icon/Icon.svelte'
import { getDb } from '$lib/db'
import { testAuth } from '$lib/db/auth'
import type { CollectionName, VoteRecord } from '$lib/db/db.types'
import { getThumbnailUrl } from '$lib/utils/cloudflare'
import { pluralize } from '$lib/utils/pluralize'
import { anonUser, authState } from '$stores/auth'
import userProfile from '$stores/userProfile'
import { yearsToMonths } from 'date-fns'
import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import { onMount, tick } from 'svelte'
import { fade } from 'svelte/transition'

let votes: VoteRecord[] = []
let loading = true

async function getVotes() {
  try {
    await tick()
    const db = getDb()
    const col = collection(db, 'votes' as CollectionName)
    if ($authState.isLoggedIn) {
      const data = await getDocs(
        query(
          col,
          where('uid', '==', $authState.userId),
          where('anon', '==', false),
        ),
      )
      data.forEach((doc) => {
        votes.push(doc.data() as VoteRecord)
      })
    } else {
      const data = await getDocs(
        query(col, where('uid', '==', $anonUser.id), where('anon', '==', true)),
      )
      data.forEach((doc) => {
        votes.push(doc.data() as VoteRecord)
      })
    }
  } catch (e) {
    console.error('Error loading votes', e)
  } finally {
    loading = false
  }
}

onMount(() => {
  getVotes()
  testAuth()
})
</script>

<div transition:fade class="mt-20 h-full w-full bg-black px-4 py-2">
  {#if loading}
    <Icon name="loading" class="h-4 w-4 animate-spin-slow" />
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
                <span class="text-xs font-thin uppercase">Your vote</span>
                <span class="pb-2 text-sm font-bold md:text-lg">
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
      No votes placed yet
    {/if}
  {:else}
    Login to view results
  {/if}
</div>
