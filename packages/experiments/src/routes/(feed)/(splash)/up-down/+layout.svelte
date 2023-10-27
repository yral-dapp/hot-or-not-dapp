<script lang="ts">
import HotOrNotLayout from '$components/layout/HotOrNotLayout.svelte'
</script>

<svelte:head>
  <title>Up Down | Hot or Not</title>
</svelte:head>

<HotOrNotLayout>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
</HotOrNotLayout>
