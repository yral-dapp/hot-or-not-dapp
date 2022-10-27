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
import GoogleAnalytics from '$components/seo/GoogleAnalytics.svelte';
import { hideSplashScreen } from '$stores/splashScreen';
import LogRocket from 'logrocket';

const ignoredPaths = ['edit', 'lovers', 'post'];

beforeNavigate(({ from, to }) => {
	if (
		ignoredPaths.some((path) => from?.url.pathname.includes(path)) ||
		ignoredPaths.some((path) => to?.url.pathname.includes(path))
	)
		return;
	$navigateBack = from?.url.pathname ?? null;
});

onMount(async () => {
	if (browser) {
		try {
			hideSplashScreen(10000);
			$navigateBack = null;
			window.Buffer = Buffer;
			if (process.env.NODE_ENV != 'development') {
				LogRocket.init('c77ths/hotornot');
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

<GoogleAnalytics />

<div class="safe-bottom relative h-full w-full overflow-hidden overflow-y-auto">
	<CornerRibbon>Alpha</CornerRibbon>
	<slot />
</div>
