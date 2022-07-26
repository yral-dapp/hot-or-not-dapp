<script lang="ts">
export let type: 'primary' | 'secondary' = 'primary';
export let href = '';
let exportClass: any = '';
export { exportClass as class };

const commonClasses =
	'flex items-center rounded-full justify-center px-4 py-3 font-bold text-white';
</script>

{#if href}
	<a
		href="{href}"
		class="{commonClasses} {type === 'primary'
			? 'bg-orange-500'
			: 'border-2 border-white/20 bg-transparent'} {exportClass}"
	>
		<slot />
	</a>
{:else}
	<button
		on:click
		class="{commonClasses} {type === 'primary'
			? 'bg-orange-500'
			: 'border-2 border-white/20 bg-transparent'} {exportClass}"
	>
		<slot />
	</button>
{/if}
