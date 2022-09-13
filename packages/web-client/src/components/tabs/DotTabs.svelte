<script lang="ts">
export let tabs: string[];
export let selectedIndex: number;
</script>

<dot-tabs class="flex w-full shrink-0 items-center justify-center space-x-6 py-4">
	{#each tabs as tab, i}
		{@const active = selectedIndex == i}
		<button
			on:click="{() => (selectedIndex = i)}"
			on:click
			class="relative transition-colors duration-200 {active ? 'text-white' : 'text-white/50'}">
			{tab}
			{#if active}
				<div class="absolute inset-x-0 -bottom-2 mx-auto h-2 w-2 rounded-full bg-primary"></div>
			{/if}
		</button>
	{/each}
</dot-tabs>
