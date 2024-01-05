<script lang="ts">
import Button from '@hnn/components/button/Button.svelte'
import Icon from '@hnn/components/icon/Icon.svelte'

export let loading = true
</script>

{#if loading}
  <div class="flex h-[6.5rem] items-center justify-center space-x-2">
    <Icon name="loading" class="h-4 w-4 animate-spin" />
    <span class="opacity-20">Loading</span>
  </div>
{:else}
  <div class="flex h-24 w-full max-w-xs items-center justify-center">
    <Button on:click class="w-full">Login</Button>
  </div>
{/if}
