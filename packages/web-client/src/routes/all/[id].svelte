<script lang="ts" context="module">
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
	// console.log('fetch video with id', params.id);
	const id = Number(params.id);
	return {
		props: {
			startingVideoIndex: isNaN(id) ? 0 : id
		}
	};
};
</script>

<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte';
import Videos from '$components/video/Videos.svelte';
import BottomNavigation from '$components/bottom-navigation/BottomNavigation.svelte';

export let startingVideoIndex: number;
</script>

<HomeLayout>
	<svelte:fragment slot="content">
		<Videos fetchFromId="{startingVideoIndex}" />
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<BottomNavigation />
	</div>
</HomeLayout>
