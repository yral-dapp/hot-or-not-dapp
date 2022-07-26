<script lang="ts">
export let videos: Boolean;
</script>

<div class="fixed right-7 {videos ? 'bottom-20' : 'bottom-28'}">
	<div class="flex flex-col space-y-12 ">
		{#each new Array(videos ? 3 : 2) as _}
			<div class="flex items-center justify-center flex-1 group">
				<span
					class="w-6 h-6 p-2 border-2 border-white rounded-full group-hover:border-orange-500 group-hover:bg-orange-500"
				>
				</span>
			</div>
		{/each}
	</div>
</div>
