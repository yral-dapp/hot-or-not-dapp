<script lang="ts">
import Button from '$components/button/Button.svelte'
import Icon from '$components/icon/Icon.svelte'
import LoginButton from '$components/login/LoginButton.svelte'
import { authState } from '$stores/auth'
import userProfile from '$stores/userProfile'

let loggedIn = false
</script>

<div
  class="flex h-full w-full flex-col justify-between space-y-16 overflow-hidden overflow-y-auto px-8 py-20">
  <div class="flex w-full shrink-0 flex-col space-y-10">
    {#if loggedIn}
      <div class="text-3xl font-bold">Success!</div>
      <Icon name="checkmark" class="h-10 w-10"></Icon>
      <div>You have succesfully migrated your hot or not profile.</div>
      <div class="text-sm">
        Please, also migrate all of your profiles (if you have any)
      </div>

      <Button on:click={() => window.close()}>Take me back!</Button>
    {:else}
      <div class="flex items-center justify-center">
        <div class="text-3xl font-bold">Success!</div>
        <div>You are reaunticating your profile to connect to our dapp</div>
        <div>Make sure this is your profile for the same:</div>
        <img
          alt="profile"
          class="h-24 w-24 rounded-full object-cover"
          src={$userProfile.profile_picture_url} />
        <div class="flex flex-col space-y-1">
          <div class="text-xl">
            {$userProfile.display_name}
          </div>
        </div>

        <Button on:click={() => (loggedIn = true)}>Re-authneticate</Button>
      </div>
    {/if}

    <div class="flex flex-col items-center justify-center space-y-4">
      <div class="text-sm text-white/50">What is this?</div>
      <div>
        We are migrating our platform so we need you to reautnticate.
        <br />
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
        when an unknown printer took a galley of type and scrambled it to make a
        type specimen book. It has survived not only five centuries, but also the
        leap into electronic typesetting, remaining essentially unchanged. It was
        popularised in the 1960s with the release of Letraset sheets containing Lorem
        Ipsum passages, and more recently with desktop publishing software like Aldus
        PageMaker including versions of Lorem Ipsum.
      </div>
    </div>
  </div>
</div>
