<script lang="ts">
import Button from '$lib/components/button/Button.svelte'
import Icon from '$lib/components/icon/Icon.svelte'
import { authState, loadingAuthStatus } from '$lib/stores/auth'
</script>

{#if $loadingAuthStatus}
  <div class="flex h-[6.5rem] items-center justify-center space-x-2">
    <Icon name="loading" class="h-4 w-4 animate-spin" />
    <span class="opacity-20">Loading</span>
  </div>
{:else}
  <div class="flex h-24 w-full max-w-xs items-center justify-center">
    <Button on:click={() => ($authState.showLogin = true)} class="w-full">
      Login
    </Button>
  </div>
{/if}
