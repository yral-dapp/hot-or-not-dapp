<script lang="ts">
import { page } from '$app/stores';
import SplashScreen from '$components/layout/SplashScreen.svelte';
import VideosSwiper from '$components/video/VideosSwiper.svelte';

let startingVideoIndex = Number($page.params.id) ?? 0;
</script>

<SplashScreen showOnPath="{$page.url.pathname.includes('all')}" />

<VideosSwiper fetchFromId="{startingVideoIndex}" />
