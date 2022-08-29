<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte';
import BottomNavigation from '$components/bottom-navigation/BottomNavigation.svelte';
import { page } from '$app/stores';
import Videos from '$components/video/Videos.svelte';

let startingVideoIndex = Number($page.params.id) ?? 0;
</script>

<HomeLayout>
	<svelte:fragment slot="content">
		<Videos fetchFromId="{startingVideoIndex}" />
	</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<BottomNavigation />
	</div>
</HomeLayout>
