<script lang="ts" context="module">
type ReportType = 'profile' | 'post'

type PostReportData = {
  postCanisterId: string
  postUploadedByUserId: string
  postId: string
  reportedByUserId: string
  videoUid: string
}

type ProfileReportData = {
  userId: string
  reportedByUserId: string
}
</script>

<script lang="ts">
import Button from '$lib/components/button/Button.svelte'
import Popup from './Popup.svelte'
import { saveReportedPostInDb } from '$lib/helpers/feed'

export let show = false
export let type: ReportType
export let reportData: PostReportData | ProfileReportData

let loading = false
let selectedReason = ''

async function handleReport() {
  loading = true
  let text = ''
  if (type === 'post') {
    const data = reportData as PostReportData
    text = `🎞️ Video reported 🚨  
    Video Link: https://hotornot.wtf/profile/${data.postUploadedByUserId}/post/${data.postId}
    Profile Link: https://hotornot.wtf/profile/${data.postUploadedByUserId}
    Reported Video ID: ${data.postCanisterId}@${data.postId} 
    Reported Video Cloudflare UID: ${data.videoUid} 
    Reported by: ${data.reportedByUserId} 
    Reason: ${selectedReason}`

    // Save post to DB
    saveReportedPostInDb(
      `${data.postCanisterId}@${data.postId}`,
      selectedReason,
    )
  } else {
    const data = reportData as ProfileReportData
    text = `👮 Profile reported 🚨
    Profile Link: https://hotornot.wtf/profile/${data.userId}
    Reported by: ${data.reportedByUserId} 
    Reason: ${selectedReason}`
  }
  await fetch(
    'https://chat.googleapis.com/v1/spaces/AAAAHzDmNaM/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=nUnkgIqr0tLjDV5lWRge9tqEN5Nq9YX14wU9e9HUCiU%3D',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    },
  )

  loading = false
  show = false
}
</script>

<Popup showCloseButton bind:show>
  <div class="flex flex-col space-y-4">
    <div class="text-md pb-2 text-center text-black">Report Video</div>
    <div class="text-md pb-2 text-center text-black">
      Please select a reason why you are reporting this video
    </div>
    <select
      class="rounded-sm border-0 text-black disabled:text-black/50"
      bind:value={selectedReason}>
      <option value="" disabled selected>Click a reason</option>
      <option value="nudity">Nudity/Porn</option>
      <option value="violence">Violence/Gore</option>
      <option value="offensive">Offensive</option>
      <option value="spam">Spam/Ad</option>
      <option value="others">Others</option>
    </select>
    <Button
      on:click={handleReport}
      disabled={loading || !selectedReason}
      type="primary">
      Report
    </Button>
  </div>
</Popup>
