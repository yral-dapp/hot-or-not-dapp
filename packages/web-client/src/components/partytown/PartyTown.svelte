<script lang="ts">
import { partytownSnippet } from '@builder.io/partytown/integration';
import GoogleAnalytics from '$components/seo/GoogleAnalytics.svelte';
import { onMount } from 'svelte';

let scriptEl;
onMount(() => {
	if (scriptEl) {
		scriptEl.textContent = partytownSnippet();
	}
});
</script>

<svelte:head>
	<script>
	partytown = {
		forward: ['dataLayer.push'],
		resolveUrl: (url) => {
			const siteUrl = 'https://hotornot.wtf/proxytown';

			if (url.hostname === 'www.googletagmanager.com') {
				const proxyUrl = new URL(`${siteUrl}/gtm`);

				const gtmId = new URL(url).searchParams.get('id');
				gtmId && proxyUrl.searchParams.append('id', gtmId);
				return proxyUrl;
			}

			return url;
		}
	};
	</script>
	<script bind:this="{scriptEl}"></script>
	<script type="text/partytown" src="https://www.googletagmanager.com/gtag/js"></script>
	<script type="text/partytown">
	window.dataLayer = window.dataLayer || [];

	function gtag() {
		dataLayer.push(arguments);
	}
	gtag('js', new Date());
	</script>
</svelte:head>

<GoogleAnalytics />
