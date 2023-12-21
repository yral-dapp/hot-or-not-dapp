<script lang="ts">
import IconButton from '$lib/components/button/IconButton.svelte'
import HotOrNotLayout from '$lib/components/layout/HotOrNotLayout.svelte'
import ExperimentsPopup from '$lib/components/popup/ExperimentsPopup.svelte'

let showExperimentsPopup = false
</script>

<!-- <HotorNotOnboarding /> -->

<svelte:head>
  <title>Hot or Not Feed | Hot or Not</title>
</svelte:head>

<HotOrNotLayout>
  <svelte:fragment slot="content">
    <div class="pointer-events-auto absolute left-1 top-12 z-[50]">
      <IconButton
        title="What's new"
        iconName="stamp"
        class="relative text-primary transition-colors active:text-primary/50"
        iconClass="h-16 w-16 m-2 animate-spin-slower drop-shadow-xl"
        ariaLabel="What's new"
        on:click={(e) => {
          e.stopImmediatePropagation()
          showExperimentsPopup = true
        }}>
        <div
          class="absolute inset-0 m-2 flex items-center justify-center font-bold text-white">
          NEW!
        </div>
      </IconButton>
    </div>
    {#if showExperimentsPopup}
      <ExperimentsPopup bind:show={showExperimentsPopup} />
    {/if}

    <slot />
  </svelte:fragment>
</HotOrNotLayout>
