<script lang="ts">
import { submitUserStudyInfo, userStoryStore } from '$lib/helpers/user-study'
import { userProfile } from '$lib/stores/app'
import { authState } from '$lib/stores/auth'
import { registerEvent } from '@hnn/components/analytics/GA.utils'
import Button from '@hnn/components/button/Button.svelte'
import Input from '@hnn/components/input/Input.svelte'
import OverlayPopup from '@hnn/components/popup/OverlayPopup.svelte'

export let show = false
let loading = false
let finished = false

let name = ''
let email = ''
let error = ''

async function sendInfoToBackend() {
  error = ''
  loading = true
  try {
    if (name.length < 3) {
      error = 'Please enter your full name'
      return
    }
    await submitUserStudyInfo(email, name)
    registerEvent('beta_tester_submit', {
      user_id: $authState.idString,
      display_name: $userProfile.display_name,
      feed_type: $userStoryStore.feedType,
      video_id: $userStoryStore.videoId,
      video_publisher_id: $userStoryStore.videoCanisterId,
      video_ref_id: `${$userStoryStore.videoCanisterId}@${$userStoryStore.videoId}`,
    })
    finished = true
  } finally {
    loading = false
  }
}

async function doNotShowAgain() {
  if (!finished) {
    registerEvent('beta_tester_reject', {
      user_id: $authState.idString,
      display_name: $userProfile.display_name,
      feed_type: $userStoryStore.feedType,
      video_id: $userStoryStore.videoId,
      video_publisher_id: $userStoryStore.videoCanisterId,
      video_ref_id: `${$userStoryStore.videoCanisterId}@${$userStoryStore.videoId}`,
    })
    await submitUserStudyInfo('not-interested', 'not-interested')
  }
  show = false
}
</script>

<OverlayPopup showCloseButton={!finished} bind:show on:close={doNotShowAgain}>
  <div class="flex flex-col items-center space-y-4 p-5 text-white">
    {#if finished}
      <div class="pb-2 text-center text-xl font-bold">Thank you!</div>
      <div class="pb-4 text-center">
        You are a rockstar. Still back, someone from our team will reach out to
        you with next steps.
      </div>
      <Button class="w-full" on:click={() => (show = false)}>Continue</Button>
    {:else}
      <div class="pb-2 text-center text-xl font-bold">
        You are the chosen one!
      </div>
      <div class="text-center">
        Fill in your details to participate in the beta testing program.
      </div>
      <form class="flex flex-col space-y-8" on:submit={sendInfoToBackend}>
        <div class="flex w-full flex-col gap-1">
          <div class="text-sm">Your name</div>
          <Input
            disabled={loading}
            required
            autocomplete="name"
            bind:value={name}
            placeholder="Enter your name"
            class="flex-1 rounded-md border-0 bg-white p-2 text-sm text-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
        </div>
        <div class="flex w-full flex-col gap-1">
          <div class="text-sm">Your email</div>
          <Input
            disabled={loading}
            required
            autocomplete="email"
            type="email"
            bind:value={email}
            placeholder="Enter your email"
            class="flex-1 rounded-md border-0 bg-white p-2 text-sm text-black outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
        </div>
        {#if error}
          <div class="text-sm font-medium text-red-500">Error: {error}</div>
        {/if}
        <div class="text-xs">
          By submitting the form you agree to receive email communication from
          Hot or Not team.
        </div>
        <div class="w-full px-8">
          <Button submit class="w-full" disabled={loading}>
            {loading ? '...' : 'Submit'}
          </Button>
        </div>
      </form>
    {/if}
  </div>
</OverlayPopup>
