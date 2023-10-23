<script lang="ts">
import { page } from '$app/stores'
import IconButton from '$components/button/IconButton.svelte'
import HotOrNotLayout from '$components/layout/HotOrNotLayout.svelte'
import { fade } from 'svelte/transition'

let resultPage = $page.url.pathname.includes('result')
$: walletPage = $page.url.pathname.includes('wallet')
</script>

<svelte:head>
  <title>Up Down | Hot or Not</title>
</svelte:head>

<HotOrNotLayout>
  <div class="relative mt-6 flex w-full items-center justify-center" slot="top">
    {#if !walletPage}
      <div
        transition:fade
        class="relative flex items-center justify-center space-x-6 rounded-full bg-black/50 py-3 pr-5 text-white">
        <selector
          class="absolute inset-x-0 z-[1] h-9 rounded-full bg-primary transition-all duration-200
          {resultPage
            ? 'w-20 translate-x-[10.25rem]'
            : 'w-40 translate-x-2'}" />

        <a on:click={() => (resultPage = false)} href="/up-down" class="z-[2]">
          Up & Down Game
        </a>
        <a
          on:click={() => (resultPage = true)}
          href="/up-down/results"
          class="z-[2] flex items-center space-x-2">
          Results
        </a>
      </div>
      <IconButton
        href="/up-down/wallet"
        class="absolute right-4"
        iconName="wallet-fill"
        iconClass="h-6 w-6 text-white" />
    {/if}
  </div>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
</HotOrNotLayout>
