<script lang="ts">
import HeartIcon from '$components/icons/HeartIcon.svelte';

export let id: string;
export let imageBg: string;
export let likes: number;
</script>

<a
	href="/all/?id={id}"
	class="relative h-40 w-full rounded-md bg-cover"
	style="background-image: url('{imageBg}')"
>
	<div class="pointer-events-none absolute inset-x-0 left-2 bottom-2 flex items-center space-x-1">
		<div class="flex h-5 w-5 items-center justify-center rounded-full bg-black/50">
			<HeartIcon class="h-3 w-3 text-primary" />
		</div>
		<div class="text-xs">
			{likes}
		</div>
	</div>
</a>
