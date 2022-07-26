<script lang="ts">
export let siteTitle: string;
export let siteDescription: string;
</script>

<svelte:head>
	<title>{siteTitle}</title>
	<meta name="description" content="{siteDescription}" />

	<!-- Open Graph data -->
	<meta property="og:url" content="{window.location.href}" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="{siteTitle}" />
	<meta property="og:description" content="{siteDescription}" />
	<meta
		property="og:image"
		content="{`${window.location.origin}/assets/logos/logo-square-192.png`}"
	/>
</svelte:head>
