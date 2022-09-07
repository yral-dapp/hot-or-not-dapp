<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte';
import Selector from '$components/home/Selector.svelte';
import HotOrNot from '$components/navigation/HotOrNot.svelte';
</script>

<HomeLayout view="hot-or-not">
	<svelte:fragment slot="top">
		<Selector selected="hot-or-not" />
	</svelte:fragment>
	<svelte:fragment slot="content">
		<slot />
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<HotOrNot />
	</div>
</HomeLayout>
