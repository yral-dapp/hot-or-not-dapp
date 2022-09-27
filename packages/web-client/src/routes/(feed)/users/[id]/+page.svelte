<script lang="ts">
import HomeLayout from '$components/layout/HomeLayout.svelte';
import BottomNavigation from '$components/navigation/BottomNavigation.svelte';
import { page } from '$app/stores';
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';

let startingVideoIndex = Number($page.params.id) ?? 0;
</script>

<HomeLayout>
	<svelte:fragment slot="top">
		<div class="flex items-center rounded-full bg-black/10 py-2 px-4">User's Videos</div>
		<div class="absolute top-4 left-4">
			<IconButton>
				<CaretLeftIcon class="h-5 w-5" />
			</IconButton>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content">content</svelte:fragment>
	<div class="w-full" slot="bottom-navigation">
		<BottomNavigation />
	</div>
</HomeLayout>
