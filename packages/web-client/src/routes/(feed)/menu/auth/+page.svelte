<script lang="ts">
import Button from '@hnn/components/button/Button.svelte'
import LoginButton from '$lib/components/auth/LoginButton.svelte'
import { authState, loadingAuthStatus } from '$lib/stores/auth'
import { userProfile } from '$lib/stores/app'
</script>

<div
  class="flex h-full w-full flex-col justify-between space-y-16 overflow-hidden overflow-y-auto px-8 py-20">
  <div class="flex w-full shrink-0 flex-col space-y-10">
    {#if $authState.isLoggedIn}
      <div class="sticky flex w-full items-center space-x-4 pb-2">
        <img
          alt="profile"
          class="h-24 w-24 rounded-full object-cover"
          src={$userProfile.profile_picture_url} />
        <div class="flex flex-col space-y-1">
          <div class="text-xl">
            {$userProfile.display_name}
          </div>
        </div>
      </div>
      <div>Please login again to connect your account to our dApp.</div>
      <Button href="/menu/reauth" target="_blank">Take me there</Button>
    {:else}
      <div class="flex items-center justify-center">
        <LoginButton
          loading={$loadingAuthStatus}
          on:click={() => ($authState.showLogin = true)} />
      </div>
    {/if}

    <div class="flex flex-col items-center justify-center space-y-4">
      <div class="text-sm text-white/50">What is this?</div>
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </div>
    </div>
  </div>
</div>
