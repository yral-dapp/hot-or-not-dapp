<script lang="ts">
import HotOrNotLayout from '$components/layout/HotOrNotLayout.svelte';
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
