<script lang="ts">
import IconButton from '@hnn/components/button/IconButton.svelte'
import HotOrNotLayout from '@hnn/components/web-client/layout/HotOrNotLayout.svelte'
import ExperimentsPopup from '@hnn/components/popup/ExperimentsPopup.svelte'
import ReportPopup from '@hnn/components/popup/ReportPopup.svelte'
import { postReportPopup } from '$lib/stores/popups'
import { reportPostOrUser } from '$lib/helpers/report'
import HotorNotOnboarding from '$lib/components/popup/HotorNotOnboarding.svelte'

let showExperimentsPopup = false
</script>

<HotorNotOnboarding />

<svelte:head>
  <title>Hot or Not Feed | Hot or Not</title>
</svelte:head>

<HotOrNotLayout>
  <svelte:fragment slot="content">
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
