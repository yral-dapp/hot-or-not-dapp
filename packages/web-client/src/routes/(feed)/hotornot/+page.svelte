<script lang="ts">
import ComingSoon from '$components/coming-soon/ComingSoon.svelte';
import HotOrNot from '$components/navigation/HotOrNot.svelte';
</script>

<ComingSoon />

<div
	style="-webkit-transform: translate3d(0, 0, 0);"
	class="pointer-events-none absolute inset-x-0 bottom-12 z-[5] max-h-48 opacity-20">
	<HotOrNot />
</div>
