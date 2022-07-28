<script>
import Avatar from '$components/avatar/Avatar.svelte';
import Home from '$components/layout/HomeLayout.svelte';
import Video from '$components/video/Video.svelte';

let videos = [
	'https://assets.mixkit.co/videos/preview/mixkit-weeds-waving-in-the-breeze-1178-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-stunning-sunset-seen-from-the-sea-4119-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-metal-surface-engraved-with-ornaments-34505-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-a-brush-painting-on-a-blue-wall-2308-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-computer-fan-with-neon-lights-2382-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-fountain-in-a-garden-2674-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-old-street-at-night-3456-large.mp4',
	'https://assets.mixkit.co/videos/preview/mixkit-tourists-skiing-on-a-snowy-slope-in-canada-3351-large.mp4'
];

let currentVideoIndex = 0;
</script>

<Home>
	<svelte:fragment slot="video">
		<div
			class="hide-scrollbar relative h-screen w-full snap-y snap-mandatory overflow-hidden overflow-y-auto bg-black"
		>
			{#each videos as video, i}
				<Video
					paused="{i != currentVideoIndex}"
					load="{currentVideoIndex - 2 < i && currentVideoIndex + 2 > i}"
					src="{video}"
				/>
			{/each}
		</div>
	</svelte:fragment>
	<div slot="top">All videos</div>
	<div slot="bottom-navigation">Bottom</div>
	<div class="pointer-events-auto flex space-x-3" slot="bottom-description">
		<Avatar
			class="h-12 w-12"
			src="https://images.pexels.com/photos/3276046/pexels-photo-3276046.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
		/>
		<div class="flex flex-col space-y-1">
			<span>Natasha</span>
			<div class="flex items-center space-x-1">
				<span class="h-3 w-3 rounded-full border-2"></span>
				<span class="text-sm">2500</span>
			</div>
		</div>
	</div>
	<div class="flex flex-col space-y-4" slot="bottom-right-controls">
		<div class="h-8 w-8 rounded-full border-2"></div>
		<div class="h-8 w-8 rounded-full border-2"></div>
		<div class="h-8 w-8 rounded-full border-2"></div>
	</div>
</Home>
