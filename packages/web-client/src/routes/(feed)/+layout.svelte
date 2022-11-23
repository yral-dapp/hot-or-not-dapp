<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte';
import BottomNavigation from '$components/navigation/BottomNavigation.svelte';
import Selector from '$components/home/Selector.svelte';
import type { LayoutData } from './$types';

export let data: LayoutData;
</script>

<HomeLayout>
	<svelte:fragment slot="top">
		{#if data.path.includes('feed') || data.path.includes('hotornot')}
			<Selector selected="{data.path.includes('feed') ? 'videos' : 'hot-or-not'}" />
		{:else if data.path.includes('menu')}
			<div class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
				Menu
			</div>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="content">
		<slot />
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		{#if !data.path.includes('hotornot')}
			<BottomNavigation />
		{/if}
	</div>
</HomeLayout>
