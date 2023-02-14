<script lang="ts">
import Accordion from '$components/accordion/Accordion.svelte'
import IconButton from '$components/button/IconButton.svelte'
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte'
import HomeLayout from '$components/layout/HomeLayout.svelte'
import DotTabs from '$components/tabs/DotTabs.svelte'
import faq from '$lib/utils/faq'
import { slide } from 'svelte/transition'

let expandedIndex = -1
let selectedTab = 0

function toggleAccordion(i: number) {
  if (expandedIndex == i) expandedIndex = -1
  else expandedIndex = i
}
</script>

<svelte:head>
  <title>FAQ | Hot or Not</title>
</svelte:head>

<HomeLayout>
  <svelte:fragment slot="top">
    <div
      class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
      FAQs
      <div class="absolute top-4 left-4">
        <IconButton href="/menu">
          <CaretLeftIcon class="h-5 w-5" />
        </IconButton>
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div
      class="flex h-full w-full flex-col items-center space-y-4 overflow-hidden overflow-y-scroll py-20 px-8">
      <div class="w-full">Find all your answers here</div>
      <DotTabs
        on:click={() => (expandedIndex = -1)}
        bind:selectedIndex={selectedTab}
        tabs={['General', 'Tokens', 'NFTs']} />
      {#if selectedTab == 0}
        {#each faq.general as q, i}
          <Accordion
            on:click={() => toggleAccordion(i)}
            expanded={expandedIndex == i}>
            <div class="w-full truncate" slot="title">{q.title}</div>
            <div transition:slide|local slot="body" class="text-sm opacity-70">
              {q.body}
            </div>
          </Accordion>
        {/each}
      {:else if selectedTab == 1}
        {#each faq.tokens as q, i}
          <Accordion
            on:click={() => toggleAccordion(i)}
            expanded={expandedIndex == i}>
            <div class="w-full truncate" slot="title">{q.title}</div>
            <div transition:slide|local slot="body" class="text-sm opacity-70">
              {q.body}
            </div>
          </Accordion>
        {/each}
      {:else}
        {#each faq.nfts as q, i}
          <Accordion
            on:click={() => toggleAccordion(i)}
            expanded={expandedIndex == i}>
            <div class="w-full truncate" slot="title">{q.title}</div>
            <div transition:slide|local slot="body" class="text-sm opacity-70">
              {q.body}
            </div>
          </Accordion>
        {/each}
      {/if}
    </div>
  </svelte:fragment>
</HomeLayout>
