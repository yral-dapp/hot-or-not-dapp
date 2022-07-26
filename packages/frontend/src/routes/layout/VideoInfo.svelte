<script lang="ts">
export let videos: Boolean;
</script>

<div
	class="absolute flex w-full flex-col space-y-2 px-4 text-white {videos
		? 'bottom-20'
		: 'bottom-28'}"
>
	<div class="flex space-x-2">
		<div class="h-12 w-12 rounded-full border-2 border-gray-400 bg-white"></div>
		<div class="flex flex-col">
			<div>@username</div>
			<div>e 2000</div>
		</div>
	</div>
	<div class="text-sm font-normal">Lorem ipsum dolor sit amet, consect etur ......</div>
	{#if !videos}
		<div class="flex items-center space-x-2">
			{#each new Array(3) as _}
				<div class="flex items-center space-x-2 rounded-full bg-black/20 px-2 py-1">
					<span class="h-2 w-2 rounded-full border-[1px] border-white"></span>
					<span class="text-sm">12/100</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
