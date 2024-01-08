<script lang="ts">
import { page } from '$app/stores'
import Button from '@hnn/components/button/Button.svelte'
import IconButton from '@hnn/components/button/IconButton.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'
import HomeLayout from '@hnn/components/experiments/layout/HomeLayout.svelte'
import { authState } from '$lib/stores/auth'
import { onMount } from 'svelte'

function checkIfInviteIsValid() {
  const refById = $page.url.searchParams.get('userId')
  if (!refById) {
    // goto('/')
  } else {
    $authState.refById = refById
  }
}

onMount(() => {
  checkIfInviteIsValid()
})
</script>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Hot or Not
      <div class="absolute left-4 top-4">
        <IconButton
          iconName="caret-left"
          iconClass="h-7 w-7"
          href="/up-down"
          class="shrink-0" />
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div
      class="flex h-full w-full flex-col items-center space-y-4 overflow-hidden overflow-y-scroll px-8 pb-20 pt-24">
      <Icon name="hot-or-not-logo" class="h-56 w-56" />
      {#if $authState.isLoggedIn}
        <div class="shrink-0 text-center text-sm opacity-70">
          Send a referral link to your friends via link/whatsapp and win tokens
        </div>
        <Button href="/refer">Go to refer & earn</Button>
      {:else}
        <div class="pt-8 text-center text-3xl">Welcome</div>
        <div class="text-center text-sm opacity-70">
          You have been invite to join our experiments app!
        </div>
        <div class="flex h-24 w-full items-center justify-center">
          <Button on:click={() => ($authState.showLogin = true)} class="w-full">
            Join now
          </Button>
        </div>
        <div class="text-center text-sm opacity-70">
          or you can visit our homepage to check out hottest videos!
        </div>
        <Button href="/">Go to homepage</Button>
      {/if}
    </div>
  </svelte:fragment>
</HomeLayout>
