<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CaretLeftIcon from '$components/icons/CaretLeftIcon.svelte';
import HomeLayout from '$components/layout/HomeLayout.svelte';
</script>

<HomeLayout>
	<svelte:fragment slot="top">
		<div class="flex w-full items-center justify-center bg-black py-4 shadow-xl shadow-black/50">
			Privacy Policy
			<div class="absolute top-4 left-4">
				<IconButton href="/menu">
					<CaretLeftIcon class="h-5 w-5" />
				</IconButton>
			</div>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="content">
		<div class="flex h-full w-full flex-col space-y-8 overflow-hidden overflow-y-auto py-20 px-8">
			<div class="flex flex-col space-y-2">
				<div class="text-sm">1. Terms</div>
				<div class="text-xs">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea comm odo consequat. Duis aute irure dolor in
					reprehende rit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
				</div>
			</div>
			<div class="flex flex-col space-y-2">
				<div class="text-sm">2. Use License</div>
				<div class="text-xs">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum
					dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
					dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
					nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
					voluptate velit esse cillum dolore eu fugiat nulla pariatur.
				</div>
			</div>
			<div class="flex flex-col space-y-2">
				<div class="text-sm">3. Copyright</div>
				<div class="text-xs">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
					ullamco laboris nisi ut aliquip ex ea comm odo consequat. Duis aute irure dolor in
					reprehende rit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum
					dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
					dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
					nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
					voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit
					amet.Lorem ipsum dolor sit amet, eiusmod tempor incididunt ut labore et dolore magna
					aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
					ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
					cillum dolore eu fugiat nulla
				</div>
			</div>
		</div>
	</svelte:fragment>
</HomeLayout>
