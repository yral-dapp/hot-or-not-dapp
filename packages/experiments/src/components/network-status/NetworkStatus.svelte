<script lang="ts">
import { slide } from 'svelte/transition'

let offline = false
let networkStatus: 'offline' | 'online' = 'online'
</script>

<svelte:window
  on:offline={() => {
    networkStatus = 'offline'
    offline = true
  }}
  on:online={() => {
    offline = false
    setTimeout(() => (networkStatus = 'online'), 500)
  }} />

{#if networkStatus === 'offline'}
  <network-status
    transition:slide|local
    class="fixed z-[51] flex h-5 w-full items-center justify-center text-xs text-white {offline
      ? 'bg-red-500'
      : 'bg-green-500'}">
    {#if offline}
      Offline. Please check your internet connection.
    {:else}
      Online
    {/if}
  </network-status>
{/if}
