<script lang="ts">
import CheckIcon from '$components/icons/CheckIcon.svelte';
import c from 'clsx';
export let step: 1 | 2 | 3 = 1;
export let status: 'queued' | 'active' | 'finished' = 'queued';
</script>

<div
	class="{c('-mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', {
		'border-white/50': status === 'queued',
		'border-primary': status === 'active',
		'border-2': status !== 'finished',
		'bg-green-500': status === 'finished'
	})}"
>
	{#if status !== 'finished'}
		{step}
	{:else}
		<CheckIcon class="h-4 w-4 text-white" />
	{/if}
</div>
