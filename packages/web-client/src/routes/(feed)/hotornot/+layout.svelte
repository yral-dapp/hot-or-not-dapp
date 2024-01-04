<script lang="ts">
import IconButton from '@hnn/components/button/IconButton.svelte'
import HotOrNotLayout from '@hnn/components/layout/HotOrNotLayout.svelte'
import ExperimentsPopup from '@hnn/components/popup/ExperimentsPopup.svelte'
import ReportPopup from '@hnn/components/popup/ReportPopup.svelte'
import { postReportPopup } from '$lib/stores/popups'
import { reportPostOrUser } from '$lib/helpers/report'

let showExperimentsPopup = false
</script>

<!-- <HotorNotOnboarding /> -->

<svelte:head>
  <title>Hot or Not Feed | Hot or Not</title>
</svelte:head>

<HotOrNotLayout>
  <svelte:fragment slot="content">
    <div class="pointer-events-auto absolute left-1 top-12 z-[12]">
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

{#if $postReportPopup.show && $postReportPopup.data}
  <ReportPopup
    type="post"
    on:close={() =>
      ($postReportPopup = {
        show: false,
      })}
    show
    on:report={({ detail }) => reportPostOrUser(detail)}
    reportData={$postReportPopup.data} />
{/if}

{#if showExperimentsPopup}
  <ExperimentsPopup bind:show={showExperimentsPopup} />
{/if}
