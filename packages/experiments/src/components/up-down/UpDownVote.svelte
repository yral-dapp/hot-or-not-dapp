<script lang="ts" context="module">
export type UpDownVoteDetails = {
  direction: VoteRecord['voteDirection']
  voteAmount: number
  status: VoteRecord['status']
  created_at: number
  result?: VoteRecord['result']
}
</script>

<script lang="ts">
import { getDb } from '$lib/db'
import { placeVote } from '$lib/db/actions'
import { writable } from 'svelte/store'

import type { CollectionName, UpDownPost, VoteRecord } from '$lib/db/db.types'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  onSnapshot,
  type Unsubscribe,
  limit,
} from 'firebase/firestore'

import UpDownVoteControls from './UpDownVoteControls.svelte'
import UpDownVoteOutcome from './UpDownVoteOutcome.svelte'
import { authState } from '$stores/auth'
import { onDestroy } from 'svelte'

export let post: UpDownPost
export let tutorialStep: number | undefined = undefined

let loading = true
let voteDocId: string | undefined = undefined
let unsubscribePost: Unsubscribe | undefined = undefined
let unsubscribeVote: Unsubscribe | undefined = undefined
let postStore = writable<UpDownPost>(post)
let voteDetails = writable<UpDownVoteDetails | undefined>(undefined)

$: if (post.id && !tutorialStep && $authState.isLoggedIn && $authState.userId) {
  observeVote()
}

if (post.id && !tutorialStep) {
  observePost()
}

async function observePost() {
  try {
    if (unsubscribePost) return
    const db = getDb()
    const watchRef = doc(db, 'ud-videos' as CollectionName, post.id)
    unsubscribePost = onSnapshot(watchRef, (doc) => {
      $postStore = doc.data() as UpDownPost
    })
  } catch (e) {
    console.log('error while observing score', e)
  }
}

async function observeVote() {
  if (unsubscribeVote) return
  const db = getDb()
  const docRef = await getDocs(
    query(
      collection(db, 'votes' satisfies CollectionName),
      where('videoId', '==', post.id),
      where('uid', '==', $authState.userId),
      limit(1),
    ),
  )
  if (!docRef.empty) {
    const vote = docRef.docs[0].data() as VoteRecord
    voteDocId = docRef.docs[0].id
    console.log({ voteDocId })
    $voteDetails = {
      direction: vote.voteDirection,
      created_at: vote.created_at,
      status: vote.status,
      result: vote.result,
      voteAmount: vote.voteAmount,
    }

    const watchRef = doc(
      db,
      'votes' satisfies CollectionName,
      docRef.docs[0].id,
    )
    unsubscribeVote = onSnapshot(watchRef, (doc) => {
      const d = doc.data() as VoteRecord
      $voteDetails = {
        direction: d.voteDirection,
        created_at: d.created_at,
        status: d.status,
        result: d.result,
        voteAmount: d.voteAmount,
      }
    })
  }
  loading = false
}

async function handlePlaceVote(vote: UpDownVoteDetails) {
  if (!post) return
  const res = await placeVote(
    {
      videoId: post.id,
      videoOid: post.oid,
      videoUoid: post.ouid,
      videoUid: post.video_uid,
    },
    vote.voteAmount,
    vote.direction,
  )
  $voteDetails = vote
}

onDestroy(() => {
  unsubscribePost?.()
  unsubscribeVote?.()
})
</script>

<up-down class="pointer-events-none block h-full w-full">
  {#if $voteDetails && !tutorialStep}
    <UpDownVoteOutcome
      {post}
      disabled={!post || loading}
      {voteDocId}
      voteDetails={$voteDetails} />
  {:else}
    <UpDownVoteControls
      score={$postStore.score}
      {tutorialStep}
      disabled={$authState.isLoggedIn ? !post || loading : false}
      on:votePlaced={({ detail }) => handlePlaceVote(detail)} />
  {/if}
</up-down>
