<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { Buffer } from 'buffer'; // @dfinity/agent requires this
import { browser } from '$app/env';
import { initializeAuthClient } from '$lib/authHelper';

onMount(async () => {
	if (browser) window.Buffer = Buffer;
	await initializeAuthClient();
});
</script>

<slot />
