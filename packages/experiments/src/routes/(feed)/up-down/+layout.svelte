<script lang="ts">
import FeedLayout from '$components/layout/FeedLayout.svelte'
import Onboarding from '$components/popup/Onboarding.svelte'
</script>

<svelte:head>
  <title>Up Down | Hot or Not</title>
</svelte:head>

<Onboarding />

<FeedLayout>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
</FeedLayout>
