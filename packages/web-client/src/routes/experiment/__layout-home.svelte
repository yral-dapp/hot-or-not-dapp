<script lang="ts">
import '../../css/app.css';
import { Buffer } from 'buffer'; // @dfinity/agent requires this. Can be removed once it's fixed
import { onMount } from 'svelte';
import { browser } from '$app/env';

onMount(async () => {
	if (browser) {
		window.Buffer = Buffer;
	}
});
</script>

<slot />
