<script lang="ts">
import '../css/app.css';
import { onMount } from 'svelte';
import { authState } from '$stores/auth';
import Login from '$components/login/Login.svelte';
import Log from '$lib/utils/Log';
import { beforeNavigate } from '$app/navigation';
import navigateBack from '$stores/navigateBack';
import GoogleAnalytics, { registerEvent } from '$components/seo/GoogleAnalytics.svelte';
import { hideSplashScreen } from '$stores/splashScreen';
import { BrowserTracing } from '@sentry/tracing';
import userProfile from '$stores/userProfile';

const ignoredPaths = ['edit', 'lovers', 'post'];

beforeNavigate(({ from, to }) => {
	if (
		ignoredPaths.some((path) => from?.url.pathname.includes(path)) ||
		ignoredPaths.some((path) => to?.url.pathname.includes(path))
	)
		return;
	$navigateBack = from?.url.pathname ?? null;
});

async function initClient() {
	const { Buffer } = await import('buffer'); // @dfinity/agent requires this
	window.Buffer = Buffer;
	const { initializeAuthClient } = await import('$lib/helpers/auth');
	initializeAuthClient();
}

async function initSentry() {
	const Sentry = await import('@sentry/svelte');

	if (process.env.NODE_ENV != 'development') {
		Sentry.init({
			dsn: 'https://7586a69b01314524b31c8f4f64b41988@o4504076385124352.ingest.sentry.io/4504076386238464',
			integrations: [new BrowserTracing()],
			tracesSampleRate: 1.0
		});
		Log('Sentry Initialized', 'info');
	}
}

function registerServiceWorker() {
	if ('serviceWorker' in navigator && process.env.NODE_ENV != 'development') {
		navigator.serviceWorker.register('/service-worker.js');
	}
}

onMount(() => {
	try {
		hideSplashScreen(5000);

		$navigateBack = null;

		initSentry();
		initClient();
		registerServiceWorker();
	} catch (e) {
		Log({ error: e, source: '0 layout' }, 'error');
	}
});
</script>

<svelte:window
	on:appinstalled="{() => {
		registerEvent('pwa_installed', {
			'Display Name': $userProfile.display_name,
			username: $userProfile.unique_user_name,
			userId: $userProfile.principal_id
		});
	}}" />

<GoogleAnalytics />

<alpha-ribbon
	class="pointer-events-none absolute -right-9 top-2 z-[50] flex w-28 rotate-45 items-center justify-center overflow-hidden bg-primary py-1 px-2 text-xs font-bold uppercase text-white opacity-60">
	Alpha
</alpha-ribbon>

{#if $authState.showLogin}
	<Login />
{/if}

<div class="safe-bottom relative h-full w-full overflow-hidden overflow-y-auto">
	<slot />
</div>
