<script lang="ts">
import HotOrNotLayout from '$components/layout/HotOrNotLayout.svelte';

</script>

<!-- Disabled -->
<!-- <HotorNotOnboarding /> -->

<HotOrNotLayout>
	<svelte:fragment slot="content">
		<slot />
	</svelte:fragment>
</HotOrNotLayout>
