<script lang="ts">
import { beforeNavigate } from '$app/navigation'
import { page } from '$app/stores'
import VideoSlide from '@hnn/components/video/VideoSlide.svelte'
import PlayerLayout from '$lib/components/layout/PlayerLayout.svelte'
import type { UpDownVoteDetails } from '$lib/components/vote/UpDownVote.svelte'
import UpDownVoteOutcome from '$lib/components/vote/UpDownVoteOutcome.svelte'
import VideoPlayer from '$lib/components/video/VideoPlayer.svelte'
import { getDb } from '$lib/db'
import type { CollectionName, UpDownPost, VoteRecord } from '$lib/db/db.types'
import { playerState } from '$lib/stores/playerState'
import { removeSplashScreen } from '$lib/stores/popups'
import { doc, getDoc } from 'firebase/firestore'
import { onMount } from 'svelte'
import { browser } from '$app/environment'

let loading = true
let voteDetails: UpDownVoteDetails | undefined = undefined
let videoId: string | undefined = undefined
let post: UpDownPost

$: voteId = $page.params.voteId

async function fetchVideo() {
  if (post || !videoId) return
  const db = getDb()
  const videoDoc = await getDoc(doc(db, 'ud-videos' as CollectionName, videoId))
  post = videoDoc.data() as UpDownPost
  loading = false
}

async function loadVoteDetails() {
  if (voteDetails) return
  const db = getDb()
  const docRef = await getDoc(doc(db, 'votes', voteId))
  const vote = docRef.data() as VoteRecord
  videoId = vote.videoId
  voteDetails = {
    score: vote.currentScore,
    direction: vote.voteDirection,
    result_at: vote.result_at,
    status: vote.status,
    result: vote.result,
    voteAmount: vote.voteAmount,
  }
  fetchVideo()
}

onMount(async () => {
  $playerState.initialized = false
  $playerState.muted = true
  $playerState.visible = true
  loadVoteDetails()
})

beforeNavigate(() => {
  $playerState.visible = false
  $playerState.muted = true
})
</script>

<svelte:head>
  <title>Your Votes | Hot or Not</title>
</svelte:head>

<div class="flex h-full w-full snap-always items-center justify-center">
  {#if loading}
    <div class="flex h-full w-full items-center justify-center">
      <div
        class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
        <div class="text-center text-lg font-bold">Loading</div>
      </div>
    </div>
  {:else}
    <VideoSlide index={0} single show {browser}>
      <PlayerLayout bind:post showShareButton>
        <VideoPlayer
          on:loaded={() => removeSplashScreen()}
          index={0}
          playFormat="hls"
          inView
          uid={post.video_uid} />
        <svelte:fragment slot="controls">
          {#if voteDetails}
            <UpDownVoteOutcome voteDocId={voteId} {voteDetails} />
          {/if}
        </svelte:fragment>
      </PlayerLayout>
    </VideoSlide>
  {/if}
</div>
