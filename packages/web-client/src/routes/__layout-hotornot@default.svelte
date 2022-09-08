<script lang="ts">
import Selector from '$components/home/Selector.svelte';
import HotOrNotLayout from '$components/layout/HotOrNotLayout.svelte';
</script>

<HotOrNotLayout>
	<svelte:fragment slot="top">
		<Selector selected="hot-or-not" />
	</svelte:fragment>
	<svelte:fragment slot="content">
		<slot />
	</svelte:fragment>
</HotOrNotLayout>
