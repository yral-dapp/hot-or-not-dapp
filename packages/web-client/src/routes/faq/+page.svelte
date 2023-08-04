<script lang="ts">
import Accordion from '$components/accordion/Accordion.svelte'
import IconButton from '$components/button/IconButton.svelte'
import Icon from '$components/icon/Icon.svelte'
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
      <div class="absolute left-4 top-4">
        <IconButton iconName="caret-left" iconClass="h-5 w-5" href="/menu" />
      </div>
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div
      class="flex h-full w-full flex-col items-center space-y-4 overflow-hidden overflow-y-scroll px-8 py-20">
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
