<script lang="ts">
import FeedLayout from '$components/layout/FeedLayout.svelte'
import { showOnboardingPopup } from '$stores/popups'
import { onMount } from 'svelte'

let onboarding: any
function mountOnboarding() {
  setTimeout(
    () =>
      import('$components/popup/Onboarding.svelte').then(
        (d) => (onboarding = d.default),
      ),
    3000,
  )
}

onMount(() => mountOnboarding())
</script>

<svelte:head>
  <title>Up Down | Hot or Not</title>
</svelte:head>

{#if onboarding && $showOnboardingPopup}
  <svelte:component this={onboarding} />
{/if}
<FeedLayout>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
</FeedLayout>
