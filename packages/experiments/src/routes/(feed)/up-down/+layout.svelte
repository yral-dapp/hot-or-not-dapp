<script lang="ts">
import FeedLayout from '@hnn/components/experiments/layout/FeedLayout.svelte'
import { showOnboardingPopup } from '$lib/stores/popups'
import { onDestroy, onMount } from 'svelte'

let onboarding: any
let onboardingTimeout: ReturnType<typeof setTimeout>
function mountOnboarding() {
  onboardingTimeout = setTimeout(
    () =>
      import('$lib/components/popup/Onboarding.svelte').then(
        (d) => (onboarding = d.default),
      ),
    3000,
  )
}

onMount(() => mountOnboarding())
onDestroy(() => clearTimeout(onboardingTimeout))
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
