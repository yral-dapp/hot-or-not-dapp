<script lang="ts">
import Button from '$components/button/Button.svelte'
import { getDb } from '$lib/db'
import { isDev } from '$lib/db/dev'
import { authState } from '$stores/auth'
import {
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { onMount } from 'svelte'
import { json2csv } from 'json-2-csv'

let allowed = false
let loading = true
let videoId = ''
let userId = ''
let videoError = ''
let userError = ''

async function checkIfAllowed() {
  if (!$authState.isLoggedIn) return
  const req = await isDev()
  allowed = req.allow
  loading = false
}

async function collectionToJSON(name: string, snapshot: QuerySnapshot) {
  const data: any[] = []
  snapshot.forEach((doc) => {
    data.push(doc.data())
  })
  const csv = json2csv(data)

  const downloadLink = document.createElement('a')
  const blob = new Blob(['\ufeff', csv])
  const url = URL.createObjectURL(blob)
  downloadLink.href = url
  downloadLink.download = `${name}.csv` //Name the file here
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)

  console.log({ csv })
}

async function fetchAllUserActions() {
  userError = ''
  if (!userId) {
    userError = 'No video Id'
    return
  }
  if (userId.length < 15) {
    userError = 'Invalid user ID format'
    return
  }
  const db = getDb()
  const userDoc = await getDoc(doc(db, `profile/${userId}`))
  if (!userDoc.exists) {
    userError = 'No such user found'
    return
  }
  const userActions = await getDocs(collection(db, `profile/${userId}/actions`))
  if (userActions.empty) {
    userError = 'No actions found for the user'
    return
  }
  collectionToJSON(`user-${userId}`, userActions)
}

async function fetchAllViewUpdates() {
  videoError = ''
  if (!videoId) {
    videoError = 'No video Id'
    return
  }
  if (videoId.length < 15) {
    videoError = 'Invalid video ID format'
    return
  }
  const db = getDb()
  const videoDoc = await getDoc(doc(db, `ud-videos/${videoId}`))
  if (!videoDoc.exists) {
    videoError = 'No such video found'
    return
  }
  const viewUpdates = await getDocs(
    collection(db, `ud-videos/${videoId}/view-updates`),
  )
  if (viewUpdates.empty) {
    videoError = 'No view update records for the video'
    return
  }
  collectionToJSON(`video-${videoId}`, viewUpdates)
}

onMount(() => checkIfAllowed())
</script>

{#if !allowed}
  <div
    class="text-fg-1 flex h-full w-full flex-col items-center justify-center bg-black text-white">
    <div>Oops! Seems like you are lost</div>
    <Button href="/">Go to Home</Button>
  </div>
{:else}
  <div class="select-text p-4 text-white">
    <div class="border border-white/50 p-4">
      <div class="py-2 text-xl">Current config:</div>
      {#if loading}
        <div>Loading ...</div>
      {:else}
        <div
          class="flex flex-col space-y-4 divide-y divide-gray-500 border border-white/50 p-4">
          <div class="flex flex-col space-y-1 pt-3">
            <div>Get score update hisotry of a video:</div>

            <label class="flex flex-col">
              <span>Video ID:</span>
              <input bind:value={videoId} type="text" />
            </label>
            <div>
              <Button on:click={fetchAllViewUpdates}>Download csv</Button>
            </div>
            {#if videoError}
              <div class="text-sm text-red-500">
                {videoError}
              </div>
            {/if}
          </div>

          <div class="flex flex-col space-y-1 pt-3">
            <div>Get all actions & journey of a user:</div>

            <label class="flex flex-col">
              <span>User ID:</span>
              <input bind:value={userId} type="text" />
            </label>
            <div>
              <Button on:click={fetchAllUserActions}>Download csv</Button>
            </div>
            {#if userError}
              <div class="text-sm text-red-500">
                {userError}
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
input {
  background: rgb(255, 255, 255, 0.09);
  border-radius: 8px;
}

span {
  font-size: 12px;
  color: rgb(255, 255, 255, 0.8);
}
</style>
