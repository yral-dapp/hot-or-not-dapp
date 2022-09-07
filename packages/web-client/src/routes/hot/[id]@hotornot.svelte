<script lang="ts">
import { page } from '$app/stores';
import SplashScreen from '$components/layout/SplashScreen.svelte';
import HotorNotSwiper from '$components/video/HotorNotSwiper.svelte';

let startingVideoIndex = Number($page.params.id) ?? 0;
</script>

<SplashScreen />

<HotorNotSwiper fetchFromId="{startingVideoIndex}" />
