<script lang="ts">
import Button from '$components/button/Button.svelte'
import Popup from './Popup.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'
import { saveReportedPostInDb } from '$lib/helpers/feed'

export let show = false
export let reportedPostCanisterId: string
export let reportedPostId: string
export let reportedUserId: string
export let userId: string
export let videoUid: string

let loading = false
let selectedReason = ''

async function handleReport() {
  loading = true
  await fetch(
    'https://chat.googleapis.com/v1/spaces/AAAAHzDmNaM/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=nUnkgIqr0tLjDV5lWRge9tqEN5Nq9YX14wU9e9HUCiU%3D',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: `
        Video reported 🚨 \n 
        Profile Link: https://hotornot.wtf/profile/${reportedUserId}/post/${reportedPostId}\n
        Reported Video ID: ${reportedPostCanisterId}@${reportedPostId} \n
        Reported Video Cloudflare UID: ${videoUid} \n
        Reported by: ${userId} \n
        Reason: ${selectedReason}`,
      }),
    },
  )
  saveReportedPostInDb(
    `${reportedPostCanisterId}@${reportedPostId}`,
    selectedReason,
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
