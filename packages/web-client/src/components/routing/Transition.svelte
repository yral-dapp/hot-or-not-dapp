<script lang="ts">
import { navigating } from '$app/stores';
import { fade } from 'svelte/transition';

$: loading =
	$navigating !== null && $navigating?.from?.url?.pathname !== $navigating?.to?.url?.pathname;
</script>

{#key loading}
	<div in:fade|local="{{ duration: 700 }}">
		<slot />
	</div>
{/key}
