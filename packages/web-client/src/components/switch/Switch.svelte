<script lang="ts">
export let checked = false;
</script>

<button
	on:click="{() => (checked = !checked)}"
	class="flex h-[1.4rem] w-10 items-center justify-start rounded-full transition-all duration-500 {checked
		? 'bg-white'
		: 'bg-transparent ring-1 ring-white'}">
	<div
		class="h-4 w-4 rounded-full bg-primary transition-all duration-500 {checked
			? 'translate-x-5'
			: 'translate-x-1'} ">
	</div>
</button>
