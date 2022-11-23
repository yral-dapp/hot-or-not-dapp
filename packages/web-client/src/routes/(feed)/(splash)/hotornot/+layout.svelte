<script lang="ts">
import Selector from '$components/home/Selector.svelte';
import HotOrNotLayout from '$components/layout/HotOrNotLayout.svelte';
import HotorNotOnboarding from '$components/popup/HotorNotOnboarding.svelte';
</script>

<HotorNotOnboarding />

<HotOrNotLayout>
	<svelte:fragment slot="content">
		<slot />
	</svelte:fragment>
</HotOrNotLayout>
