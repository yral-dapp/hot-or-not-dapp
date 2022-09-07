<script lang="ts">
import { page } from '$app/stores';
import HomeLayout from '$components/layout/HomeLayout.svelte';
import Selector from '$components/home/Selector.svelte';
import HotOrNot from '$components/navigation/HotOrNot.svelte';
</script>

<HomeLayout>
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
