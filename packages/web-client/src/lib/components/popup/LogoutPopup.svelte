<script lang="ts">
import Button from '@hnn/components/button/Button.svelte'
import Popup from '@hnn/components/popup/Popup.svelte'
import { authHelper } from '$lib/stores/auth'
import { initializeAuthClient } from '$lib/helpers/auth'
import { registerEvent } from '@hnn/components/analytics/GA.utils'
import userProfile from '$lib/stores/userProfile'
import Icon from '@hnn/components/icon/Icon.svelte'

export let show = false
let loading = false

async function handleLogout() {
  registerEvent('logout', {
    display_name: $userProfile.display_name,
    username: $userProfile.unique_user_name,
    userId: $userProfile.principal_id,
  })
  loading = true
  await $authHelper.client?.logout()
  await initializeAuthClient()
  loading = false
  show = false
}
</script>

<Popup showCloseButton bind:show>
  <div class="flex flex-col space-y-4">
    <div class="text-md pb-2 text-center text-black">
      Are you sure you want to logout?
    </div>
    <Button disabled={loading} on:click={handleLogout}>
      {#if loading}
        <div class="flex items-center space-x-2">
          <Icon name="loading" class="h-4 w-4 animate-spin" />
          <span>Logging you out</span>
        </div>
      {:else}
        Yes, I'm sure
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
