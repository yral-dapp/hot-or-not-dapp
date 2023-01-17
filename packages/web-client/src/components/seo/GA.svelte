<script lang="ts" context="module">
// const debugMode = import.meta.env.NODE_ENV === 'development';
const debugMode = true;

export const registerPageview = (url: URL) => {
	if (url?.href) {
		window.gtag?.('config', import.meta.env.VITE_GA_TRACKING_ID, {
			page_path: url.href,
			...(debugMode && { debug_mode: true })
		});
	}
};

export const updateConfig = (params?: Gtag.CustomParams) => {
	window.gtag?.('config', import.meta.env.VITE_GA_TRACKING_ID, {
		...params,
		...(debugMode && { debug_mode: true })
	});
};

export const setUserProperties = (params?: Gtag.CustomParams) => {
	window.gtag?.('set', 'user_properties', {
		...params
	});
};

export const registerEvent = (
	eventName: Gtag.EventNames | string,
	eventParams?: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams
) => {
	window.gtag?.('event', eventName, {
		...eventParams,
		...(debugMode && { debug_mode: true })
	});
};
</script>

<script lang="ts">
import { page } from '$app/stores';

$: href = $page.url.href;
$: if (href) {
	registerPageview(new URL(href));
}
</script>

<svelte:head>
	<script async defer src="https://www.googletagmanager.com/gtag/js"></script>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag() {
		dataLayer.push(arguments);
	}
	gtag('js', new Date());
	</script>
</svelte:head>
