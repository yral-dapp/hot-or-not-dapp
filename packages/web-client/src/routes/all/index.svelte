<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte';
import Videos from '$components/video/Videos.svelte';
import BottomNavigation from '$components/bottom-navigation/BottomNavigation.svelte';
import { page } from '$app/stores';

let startingVideoIndex = Number($page.url.searchParams.get('id')) ?? 1;
</script>

<HomeLayout>
	<svelte:fragment slot="content">
		<Videos fetchFromId="{startingVideoIndex}" />
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<BottomNavigation />
	</div>
</HomeLayout>
