<script lang="ts">
export let videos: Boolean;
</script>

{#if videos}
	<div
		class="fixed bottom-0 flex w-full h-16 text-white bg-gradient-to-t from-black to-transparent"
	>
		<div class="flex items-center justify-center flex-1">
			<span class="w-4 h-4 p-2 bg-orange-500 border-2 border-orange-500 rounded-full"></span>
			<span
				class="absolute bottom-0 w-8 h-2 bg-gradient-to-t from-orange-500 to-transparent blur-sm"
			>
			</span>
		</div>

		{#each new Array(4) as _}
			<div class="flex items-center justify-center flex-1 group">
				<span
					class="w-4 h-4 p-2 border-2 border-white rounded-full group-hover:border-orange-500 group-hover:bg-orange-500"
				></span>
				<span
					class="absolute bottom-0 w-8 h-2 opacity-0 bg-gradient-to-t from-orange-500 to-transparent blur-sm group-hover:opacity-100"
				>
				</span>
			</div>
		{/each}
	</div>
{:else}
	<div class="fixed bottom-0 flex items-center justify-center w-full h-24 space-x-6 text-white">
		{#each new Array(3) as _}
			<div class="w-16 h-16 border-2 border-white rounded-full"></div>
		{/each}
	</div>
{/if}
