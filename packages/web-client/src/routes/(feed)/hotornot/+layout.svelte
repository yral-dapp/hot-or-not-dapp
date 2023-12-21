<script lang="ts">
import HotOrNotLayout from '$lib/components/layout/HotOrNotLayout.svelte'
import HotorNotOnboarding from '$lib/components/popup/HotorNotOnboarding.svelte'
</script>

<!-- Disabled -->
<!-- <HotorNotOnboarding /> -->

<svelte:head>
  <title>Hot or Not Feed | Hot or Not</title>
</svelte:head>

<HotOrNotLayout>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
</HotOrNotLayout>
