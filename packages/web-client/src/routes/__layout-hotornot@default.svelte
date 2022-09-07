<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte';
import Selector from '$components/home/Selector.svelte';
import HotOrNot from '$components/navigation/HotOrNot.svelte';
import HotOrNotLayout from '$components/layout/HotOrNotLayout.svelte';
</script>

<HotOrNotLayout>
	<svelte:fragment slot="top">
		<Selector selected="hot-or-not" />
	</svelte:fragment>
	<svelte:fragment slot="content">
		<slot />
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<HotOrNot />
	</div>
</HotOrNotLayout>
