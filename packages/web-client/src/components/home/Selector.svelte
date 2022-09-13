<script lang="ts">
import c from 'clsx';
export let selected: 'videos' | 'hot-or-not' = 'videos';
export let showDot: 'videos' | 'hot-or-not' | null = null;
</script>

<home-selector class="flex w-full items-center justify-center pt-4">
	<div
		class="relative flex items-center justify-center space-x-6 rounded-full bg-black/50 py-3 pr-5 text-white"
	>
		<selector
			class="{c(
				'absolute inset-x-0 z-[1] h-9 rounded-full bg-primary p-4 transition-all duration-200',
				selected === 'videos' ? 'w-20 translate-x-2' : 'w-[6.75rem] translate-x-[5.25rem]'
			)}"
		>
		</selector>
		{#if showDot === 'hot-or-not'}
			<selector-dot
				class="absolute top-2 right-3 z-[2] rounded-full border-[1px] border-white/50 bg-red-500 p-[0.20rem]"
			>
			</selector-dot>
		{:else if showDot === 'videos'}
			<selector-dot
				class="absolute top-2 left-12 z-[2] rounded-full border-[1px] border-white/50 bg-red-500 p-[0.20rem]"
			>
			</selector-dot>
		{/if}

		<a href="/all" on:click="{() => (selected = 'videos')}" class="z-[2]">Videos</a>
		<a href="/hot" on:click="{() => (selected = 'hot-or-not')}" class="z-[2]">Hot or Not</a>
	</div>
</home-selector>
