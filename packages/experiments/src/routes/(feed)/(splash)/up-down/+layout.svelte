<script lang="ts">
import FeedLayout from '$components/layout/FeedLayout.svelte'
</script>

<svelte:head>
  <title>Up Down | Hot or Not</title>
</svelte:head>

<FeedLayout>
  <svelte:fragment slot="content">
    <slot />
  </svelte:fragment>
</FeedLayout>
