<script lang="ts">
import '../css/app.css';
import { Buffer } from 'buffer'; // @dfinity/agent requires this. Can be removed once it's fixed
import Transition from '$components/routing/Transition.svelte';
import { onMount } from 'svelte';
import { browser } from '$app/env';
import GoogleAnalytics from '$components/seo/GoogleAnalytics.svelte';

onMount(async () => {
	if (browser) {
		window.Buffer = Buffer;
	}
});
</script>

<Transition>
	<slot />
</Transition>
<GoogleAnalytics />
