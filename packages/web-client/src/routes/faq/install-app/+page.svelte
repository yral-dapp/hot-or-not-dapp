<script lang="ts">
import Accordion from '@hnn/components/accordion/Accordion.svelte'
import Button from '@hnn/components/button/Button.svelte'
import IconButton from '@hnn/components/button/IconButton.svelte'
import HomeLayout from '@hnn/components/layout/HomeLayout.svelte'
import { deferredPrompt } from '$lib/stores/deferredPrompt'
import { slide } from 'svelte/transition'

async function promptInstall() {
  if ($deferredPrompt) {
    $deferredPrompt.prompt()
    const { outcome } = await $deferredPrompt.userChoice
    if (outcome === 'accepted') {
      $deferredPrompt = undefined
    }
  }
}

let expandedIndex = -1

function toggleAccordion(i: number) {
  if (expandedIndex == i) expandedIndex = -1
  else expandedIndex = i
}
</script>

<svelte:head>
  <title>Install App | FAQ | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      Install App
      <div class="absolute left-4 top-4">
        <IconButton href="/menu" iconName="caret-left" iconClass="h-5 w-5" />
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div
      class="flex h-full w-full flex-col items-center space-y-4 overflow-hidden overflow-y-scroll px-8 py-20">
      <div class="w-full">How to install Hot or Not app</div>
      <Accordion
        on:click={() => toggleAccordion(0)}
        expanded={expandedIndex == 0}>
        <div class="w-full truncate" slot="title">Android</div>
        <div transition:slide slot="body" class="flex flex-col gap-4 py-3">
          <span class="text-sm opacity-70">
            Click on the button below to prompt installation
          </span>
          <div class="mx-auto">
            <Button on:click={promptInstall}>Install</Button>
          </div>
          <div class="text-sm opacity-70">
            Then accept the installation in the popup
          </div>
          <div class="mx-auto">
            <img src="https://i.imgur.com/nynbYEh.png" alt="" class="h-72" />
          </div>
          <span class="text-xs opacity-40">
            Note: Installation is only supported on Chrome, Firefox and other
            Chromium based browsers
          </span>
        </div>
      </Accordion>
      <Accordion
        on:click={() => toggleAccordion(1)}
        expanded={expandedIndex == 1}>
        <div class="w-full truncate" slot="title">iOS</div>
        <div transition:slide slot="body" class="flex flex-col gap-4 py-3">
          <span class="text-sm opacity-70">1. Click on share button</span>
          <span class="text-sm opacity-70">2. Click on Add to Home Screen</span>
          <span class="text-sm opacity-70">3. Click on Add</span>
          <div class="text-sm opacity-70">
            Here is how it'll look in Safari:
          </div>
          <div class="mx-auto">
            <img src="https://i.imgur.com/6q5OuAS.png" alt="" class="w-full" />
          </div>
        </div>
      </Accordion>
    </div>
  </svelte:fragment>
</HomeLayout>
