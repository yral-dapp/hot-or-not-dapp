<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { Buffer } from 'buffer'; // @dfinity/agent requires this
import { browser } from '$app/environment';
import { initializeAuthClient } from '$lib/helpers/auth';
import { authState } from '$stores/auth';
import Login from '$components/login/Login.svelte';
import Log from '$lib/utils/Log';
import { beforeNavigate } from '$app/navigation';
import navigateBack from '$stores/navigateBack';
import CornerRibbon from '$components/corner-ribbon/CornerRibbon.svelte';

beforeNavigate(({ from }) => {
	$navigateBack = from?.url.pathname ?? null;
});

onMount(async () => {
	if (browser) {
		try {
			$navigateBack = null;
			window.Buffer = Buffer;
			if (process.env.NODE_ENV != 'development') {
				(window as any).LogRocket && (window as any).LogRocket.init('c77ths/hotornot');
				Log('LR Initialized', 'info');
			}
			await initializeAuthClient();
		} catch (e) {
			Log({ error: e, source: '0 layout' }, 'error');
		}
	}
});
</script>

{#if $authState.showLogin}
	<Login />
{/if}

<div class="safe-bottom relative h-full w-full overflow-hidden overflow-y-auto">
	<CornerRibbon>Alpha</CornerRibbon>

	<slot />
</div>
