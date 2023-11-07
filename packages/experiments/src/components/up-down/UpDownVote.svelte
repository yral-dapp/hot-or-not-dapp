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

import type { UpDownPost, VoteRecord } from '$lib/db/db.types'
import { collection, getDocs, query, where } from 'firebase/firestore/lite'

import UpDownVoteControls from './UpDownVoteControls.svelte'
import UpDownVoteOutcome from './UpDownVoteOutcome.svelte'
import { authState } from '$stores/auth'

export let post: UpDownPost | undefined = undefined
export let score: number

let loading = true
let voteDetails: UpDownVoteDetails | undefined = undefined

$: if (post?.id && $authState.isLoggedIn && $authState.userId) {
  loadVoteDetails(post.id)
}

async function loadVoteDetails(videoId: string) {
  const db = getDb()
  const docRef = await getDocs(
    query(
      collection(db, 'votes'),
      where('videoId', '==', videoId),
      where('uid', '==', $authState.userId),
    ),
  )
  if (!docRef.empty) {
    const vote = docRef.docs[0].data() as VoteRecord
    voteDetails = {
      direction: vote.voteDirection,
      created_at: vote.created_at,
      status: vote.status,
      result: vote.result,
      voteAmount: vote.voteAmount,
    }
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
  console.log({ res })
  voteDetails = vote
}
</script>

<up-down class="pointer-events-none block h-full w-full">
  {#if voteDetails}
    <UpDownVoteOutcome disabled={!post || loading} {voteDetails} />
  {:else}
    <UpDownVoteControls
      {score}
      disabled={!post || loading}
      on:votePlaced={({ detail }) => handlePlaceVote(detail)} />
  {/if}
</up-down>
