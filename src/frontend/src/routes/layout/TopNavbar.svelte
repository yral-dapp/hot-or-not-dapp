<script lang="ts">
export let videos = true;
</script>

<div
	on:click="{() => (videos = !videos)}"
	class="fixed flex items-center justify-center w-full text-white top-4"
>
	<div class="relative flex items-center px-2 py-3 space-x-2 rounded-full bg-black/10">
		<div
			class="{videos
				? 'w-[4.5rem] translate-x-1'
				: 'w-[6rem] translate-x-20'} absolute h-8  rounded-full bg-orange-500 transition-all duration-200"
		></div>
		<div class="z-[2] px-2">Videos</div>
		<div class="z-[2] px-2">Hot or Not</div>
	</div>
	<div class="absolute right-8">
		<div class="w-8 h-8 bg-white rounded-full"></div>
	</div>
</div>
