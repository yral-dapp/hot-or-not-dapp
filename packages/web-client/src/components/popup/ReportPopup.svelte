<script lang="ts">
import Button from '$components/button/Button.svelte'
import Popup from './Popup.svelte'
import LoadingIcon from '$components/icons/LoadingIcon.svelte'

export let show = false
export let reportedPostCanisterId: string
export let reportedPostId: string
export let reportedUserId: string
export let userId: string

let loading = false

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
        text: `Video reported 🚨 \n Profile Link: https://hotornot.wtf/${reportedUserId}/post/${reportedPostId}\n Reported Video ID: ${reportedPostCanisterId}@${reportedPostId} \n Reported by: ${userId}`,
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
    <Button disabled={loading} on:click={handleReport}>
      {#if loading}
        <div class="flex items-center space-x-2">
          <LoadingIcon class="h-4 w-4 animate-spin" />
          <span>Reporting Video</span>
        </div>
      {:else}
        Select a reason to report
      {/if}
    </Button>
    <Button
      on:click={() => (show = false)}
      disabled={loading}
      type="secondary"
      class="border-black/50 text-black/70">
      Go back
    </Button>
  </div>
</Popup>
