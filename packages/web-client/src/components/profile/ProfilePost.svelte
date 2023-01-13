<script lang="ts">
import { page } from '$app/stores';
import HeartIcon from '$components/icons/HeartIcon.svelte';

export let id: number;
export let imageBg: string;
export let likes: number;
</script>

<a
	aria-roledescription="user-post"
	href="{`/profile/${$page.params.id}/post/${id}`}"
	data-sveltekit-preload-data="tap"
	class="relative aspect-[9/16] w-full cursor-pointer rounded-md overflow-hidden border-[1px] border-white/5 bg-center bg-cover"
	style="background-image: url('{imageBg}')">
	<div class="pointer-events-none absolute inset-x-0 left-2 bottom-2 flex items-center space-x-1">
		<div class="flex h-5 w-5 items-center justify-center rounded-full bg-black/50">
			<HeartIcon class="h-3 w-3 text-primary" />
		</div>
		<div class="text-xs">
			{likes}
		</div>
	</div>
</a>
