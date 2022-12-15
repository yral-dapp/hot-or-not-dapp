<script lang="ts">
export const ssr = false;
import { onMount, tick } from 'svelte';
import Hls from 'hls.js';

let hls: Hls;
let hls2: Hls;

const src =
	'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/7db7e7c40681409c92cb0392be2d1e41/manifest/video.m3u8';
const src2 =
	'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/8af436ea9ad74271990b58eeb3a58d01/manifest/video.m3u8';
const src3 =
	'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com/1314c1dc61e74c15bfb19d0b6fcf455a/manifest/video.m3u8';

let videoEl: HTMLVideoElement;

async function next() {
	if ((hls as any).current) {
		hls.detachMedia();
		(hls as any).current = false;
		await tick();
		hls2.attachMedia(videoEl);
		(hls2 as any).current = true;
		hls.destroy();
		hls = new Hls();
		hls.loadSource(src3);
	} else {
		hls2.detachMedia();
		(hls2 as any).current = false;
		await tick();
		hls.attachMedia(videoEl);
		(hls as any).current = true;
	}
}

onMount(() => {
	console.log('is hls supported', Hls.isSupported());
	hls = new Hls();
	hls.loadSource(src);
	(hls as any).current = true;
	hls.attachMedia(videoEl);
	hls2 = new Hls();
	hls2.loadSource(src2);
});
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video autoplay loop id="video" class=" border-2" bind:this="{videoEl}" controls></video>
<button on:click="{next}" class="border text-white">next</button>
