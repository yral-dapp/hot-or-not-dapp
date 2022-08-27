<script lang="ts">
import IconButton from '$components/button/IconButton.svelte';
import CloseIcon from '$components/icons/CloseIcon.svelte';
import { fade } from 'svelte/transition';

export let show = false;
</script>

{#if show}
	<div
		transition:fade|local="{{ duration: 100 }}"
		on:click="{() => (show = false)}"
		class="absolute inset-0 z-[98] flex h-full w-full items-center justify-center bg-black/50"
	>
		<div
			on:click="{(e) => e.stopImmediatePropagation()}"
			class="relative z-[99] rounded-lg bg-white p-10"
		>
			<IconButton on:click="{() => (show = false)}" class="absolute top-2 right-2">
				<CloseIcon class="h-6 w-6 text-black/50" />
			</IconButton>
			<slot />
		</div>
	</div>
{/if}
