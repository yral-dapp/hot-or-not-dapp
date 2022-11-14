<script lang="ts">
import NoVideosIcon from '$components/icons/NoVideosIcon.svelte';
import { handleParams } from '$lib/utils/params';
import { onMount } from 'svelte';

onMount(() => {
	handleParams();
});
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="relative flex h-full w-full flex-col items-center justify-center space-y-8 px-8">
		<NoVideosIcon class="w-56" />
		<div class="text-center text-lg font-bold">No video found</div>
	</div>
</div>
