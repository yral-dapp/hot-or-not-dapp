<script lang="ts" context="module">
export type UpDownVoteDetails = {
  direction: VoteRecord['voteDirection']
  voteAmount: number
  status: VoteRecord['status']
  result_at: number
  score: number
  result?: VoteRecord['result']
}

export type VoteRecordWithId = VoteRecord & {
  id: string
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
  orderBy,
} from 'firebase/firestore'

import UpDownVoteControls from './UpDownVoteControls.svelte'
import UpDownVoteOutcome from './UpDownVoteOutcome.svelte'
import { authState } from '$stores/auth'
import { onDestroy } from 'svelte'
import { registerEvent } from '@hnn/components/analytics/GA.utils'

export let post: UpDownPost
export let tutorialStep: number | undefined = undefined

let loading = true
let voteDetails: UpDownVoteDetails | undefined = undefined
let voteDocId: string | undefined = undefined
let unsubscribe: Unsubscribe | undefined = undefined
let postStore = writable<UpDownPost>(post)
let voteAgain = false

$: if (post.id && !tutorialStep && $authState.isLoggedIn && $authState.userId) {
  loadVoteDetails()
}

if (post.id && !tutorialStep) {
  observePost()
}

function observePost() {
  try {
    if (unsubscribe) return
    const db = getDb()
    const docRef = doc(db, 'ud-videos' as CollectionName, post.id)
    unsubscribe = onSnapshot(docRef, (doc) => {
      $postStore = doc.data() as UpDownPost
    })
  } catch (e) {
    console.log('error while observing score', e)
  }
}

function loadVoteDetails() {
  if (voteDetails) return
  const db = getDb()
  getDocs(
    query(
      collection(db, 'votes'),
      where('videoId', '==', post.id),
      where('uid', '==', $authState.userId),
      orderBy('created_at', 'desc'),
      limit(1),
    ),
  ).then((docRef) => {
    if (!docRef.empty) {
      const vote = docRef.docs[0].data() as VoteRecord
      voteDocId = docRef.docs[0].id
      voteDetails = {
        score: vote.currentScore,
        direction: vote.voteDirection,
        result_at: vote.result_at,
        status: vote.status,
        result: vote.result,
        voteAmount: vote.voteAmount,
      }
    }
  })
  loading = false
}

async function handlePlaceVote(vote: UpDownVoteDetails) {
  if (!post) return
  try {
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
    voteDetails = vote
    registerEvent('place_vote', {
      userId: $authState.userId,
      video_id: post.id,
      likes: post.likes_count,
      amount: vote.voteAmount,
      direction: vote.direction,
      anon: !!$authState.isLoggedIn,
    })
  } catch (e) {
    console.error('Error while placing vote', e)
    loading = false
  }
}

onDestroy(() => {
  unsubscribe?.()
})
</script>

<up-down class="pointer-events-none block h-full w-full">
  {#if voteDetails && !tutorialStep && !voteAgain}
    <UpDownVoteOutcome
      showVoteAgainButton
      disabled={!post || loading}
      {voteDocId}
      {voteDetails}
      on:voteAgain={() => (voteAgain = true)} />
  {:else}
    <UpDownVoteControls
      score={$postStore.score}
      postCreatedAt={post.created_at}
      {tutorialStep}
      disabled={$authState.isLoggedIn ? !post || loading : false}
      on:votePlaced={({ detail }) => handlePlaceVote(detail)} />
  {/if}
</up-down>
