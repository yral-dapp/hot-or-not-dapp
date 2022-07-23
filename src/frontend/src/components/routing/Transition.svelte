<script lang="ts">
import { navigating } from '$app/stores';
import { fade } from 'svelte/transition';

$: loading = $navigating !== null && $navigating.from.pathname !== $navigating.to.pathname;
</script>

{#key loading}
	<div in:fade="{{ duration: 700 }}">
		<slot />
	</div>
{/key}
