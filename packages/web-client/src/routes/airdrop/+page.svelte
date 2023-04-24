<script lang="ts">
import LoginButton from '$components/login/LoginButton.svelte'
import { authState } from '$stores/auth'
import { loadingAuthStatus } from '$stores/loading'
import userProfile from '$stores/userProfile'

$: loggedIn = $authState.isLoggedIn && !$loadingAuthStatus
</script>

<svelte:head>
  <title>Airdrop | Hot or Not</title>
</svelte:head>

{#if !loggedIn}
  <div
    class="flex h-full w-full flex-col items-center justify-center space-y-2">
    <div class="text-center text-sm text-white opacity-70">
      Please login to participate in airdrop
    </div>
    <LoginButton />
  </div>
{:else}
  {@const user_id = $authState.idString}
  {@const project_id = $authState.userCanisterId}
  <div
    class="flex h-full w-full flex-col overflow-hidden overflow-y-auto bg-[#1e202a] text-white">
    <div class="flex items-center justify-between p-6">
      <div class="flex grow flex-col space-y-1">
        <div class="text-sm">Hello!</div>
        <div class="text-md font-bold">{$userProfile.display_name}</div>
      </div>
      <img
        class="h-12 w-12 rounded-full object-cover"
        alt={$userProfile.display_name}
        src={$userProfile.profile_picture_url} />
    </div>
    <iframe
      title="Join waitlist"
      class="h-full w-full px-2 md:px-8"
      src="https://form.waitlistpanda.com/go/o4gJ2wWsWUFxfpRNVmHO?user_id={user_id}&project_id={project_id}" />
  </div>
{/if}
