<script lang="ts">
import { page } from '$app/stores';
import HomeLayout from '$components/layout/HomeLayout.svelte';
import BottomNavigation from '$components/navigation/BottomNavigation.svelte';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import Selector from '$components/home/Selector.svelte';
import { afterNavigate, goto } from '$app/navigation';

let back: string | null = null;

afterNavigate(({ from }) => {
	if (from) {
		if (from.pathname.includes('edit')) {
			back = null;
		} else back = from.pathname;
	} else back = null;
});
</script>

<HomeLayout>
	<svelte:fragment slot="top">
		{#if $page.url.pathname.includes('all')}
			<Selector selected="videos" />
		{:else if $page.url.pathname.includes('menu')}
			<div class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
				Menu
			</div>
		{:else if $page.url.pathname.includes('users')}
			<div class="flex items-center rounded-full bg-black/10 py-2 px-4">User's Videos</div>
			<div class="absolute top-4 left-4">
				<IconButton
					on:click="{() =>
						back ? goto(back) : history.length > 2 ? history.back() : goto('/menu')}">
					<CaretLeftIcon class="h-5 w-5" />
				</IconButton>
			</div>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="content">
		<slot />
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<BottomNavigation />
	</div>
</HomeLayout>
