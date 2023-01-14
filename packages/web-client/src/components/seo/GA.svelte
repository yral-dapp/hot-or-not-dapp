<script lang="ts" context="module">
const debugMode = import.meta.env.NODE_ENV === 'development';

export const registerPageview = (url: URL) => {
	window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
		page_path: url,
		...(debugMode && { debug_mode: true })
	});
};

export const updateConfig = (params?: Gtag.CustomParams) => {
	window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
		...params,
		...(debugMode && { debug_mode: true })
	});
};

export const setUserProperties = (params?: Gtag.CustomParams) => {
	window.gtag('set', 'user_properties', {
		...params
	});
};

export const registerEvent = (
	eventName: Gtag.EventNames | string,
	eventParams?: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams
) => {
	window.gtag('event', eventName, {
		...eventParams,
		...(debugMode && { debug_mode: true })
	});
};
</script>

<script lang="ts">
import { afterNavigate } from '$app/navigation';

afterNavigate(({ to }) => {
	if (to) {
		registerPageview(new URL(to.url.href));
	}
});
</script>
