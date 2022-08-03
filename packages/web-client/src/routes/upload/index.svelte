<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CloseIcon from '$components/icons/CloseIcon.svelte';
import FlashIcon from '$components/icons/FlashIcon.svelte';
import FlipIcon from '$components/icons/FlipIcon.svelte';
import TimerIcon from '$components/icons/TimerIcon.svelte';
import CameraLayout from '$components/layout/CameraLayout.svelte';
</script>

<CameraLayout>
	<svelte:fragment slot="content">
		<img
			alt="Sunset"
			class="h-full w-full object-fill"
			src="https://images.pexels.com/photos/1212600/pexels-photo-1212600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
		/>
	</svelte:fragment>
	<div class="flex h-full w-full items-center justify-center space-x-16" slot="bottom-navigation">
		<button class="focus:outline-none">Gallery</button>
		<button class="focus:outline-none">Camera</button>
	</div>
	<div class="flex w-full items-start justify-end px-5" slot="top">
		<IconButton class="h-10 w-10 rounded-full bg-black/50">
			<CloseIcon class="h-6 w-6 text-white" />
		</IconButton>
	</div>
	<div
		class="pointer-events-auto flex w-full items-center justify-center space-x-3 px-4 pb-6"
		slot="bottom-camera-controls"
	>
		<div class="h-12 w-12 rounded-full bg-blue-200"></div>
		<div class="h-12 w-12 rounded-full bg-orange-200"></div>
		<button class="px-4">
			<div class="h-14 w-14 rounded-full bg-white ring-[0.8rem] ring-white/50"></div>
		</button>
		<div class="h-12 w-12 rounded-full bg-green-200"></div>
		<div class="h-12 w-12 rounded-full bg-pink-200"></div>
	</div>
	<div
		class="pointer-events-auto flex h-full flex-col items-center justify-center"
		slot="right-camera-controls"
	>
		<div class="flex flex-col space-y-6 rounded-full bg-black/50 p-3">
			<div class="flex flex-col items-center justify-center space-y-1">
				<IconButton class="flex h-10 w-10 items-center justify-center rounded-full bg-black">
					<FlashIcon class="h-5 w-5 text-white" />
				</IconButton>
				<span class="text-xs">Flash</span>
			</div>

			<div class="flex flex-col items-center justify-center space-y-1">
				<IconButton class="flex h-10 w-10 items-center justify-center rounded-full bg-black">
					<FlipIcon class="h-5 w-5 text-white" />
				</IconButton>
				<span class="text-xs">Flip</span>
			</div>
			<div class="flex flex-col items-center justify-center space-y-1">
				<IconButton class="flex h-10 w-10 items-center justify-center rounded-full bg-black">
					<TimerIcon class="h-6 w-6 text-white" />
				</IconButton>
				<span class="text-xs">Timer</span>
			</div>
		</div>
	</div>
</CameraLayout>
