<script lang="ts">
import { page } from '$app/stores';
import HomeLayout from '$components/layout/HomeLayout.svelte';
import BottomNavigation from '$components/navigation/BottomNavigation.svelte';
import Selector from '$components/home/Selector.svelte';

$: path = $page.url.pathname;
</script>

<HomeLayout>
	<svelte:fragment slot="top">
		{#if path.includes('feed') || path.includes('hotornot')}
			<Selector selected="{path.includes('feed') ? 'videos' : 'hot-or-not'}" />
		{:else if path.includes('menu')}
			<div class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
				Menu
			</div>
			<!-- {:else if path.includes('users')}
			<div class="flex items-center rounded-full bg-black/10 py-2 px-4">User's Videos</div>
			<div class="absolute top-4 left-4">
				<IconButton
					on:click="{() =>
						back ? goto(back) : history.length > 2 ? history.back() : goto('/menu')}">
					<CaretLeftIcon class="h-5 w-5" />
				</IconButton>
			</div> -->
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="content">
		<slot />
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<BottomNavigation />
	</div>
</HomeLayout>
