<script>
import BottomNav from './BottomNav.svelte';
import RightButtonsNav from './RightButtonsNav.svelte';
import VideoInfo from './VideoInfo.svelte';
import TopNavbar from './TopNavbar.svelte';

let videos = true;
</script>

<div
	style="background-size: cover; background-image: url('https://images.pexels.com/photos/10990030/pexels-photo-10990030.jpeg?cs=srgb&dl=pexels-dmytro-kormylets-10990030.jpg&fm=jpg')"
	class="relative w-full h-full bg-black"
>
	<TopNavbar bind:videos />
	<BottomNav videos="{videos}" />
	<VideoInfo videos="{videos}" />
	<RightButtonsNav videos="{videos}" />
</div>
