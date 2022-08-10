<script lang="ts">
import c from 'clsx';

export let disabled = false;
export let href = '';
export { exportClass as class };
let exportClass: string = '';

$: classes = c(
	'flex items-center select-none justify-center focus:outline-none',
	{
		'text-zinc-500 pointer-events-none': disabled
	},
	exportClass
);
</script>

{#if href}
	<a href="{href}" class="{classes}">
		<slot />
	</a>
{:else}
	<button on:click disabled="{disabled}" class="{classes}">
		<slot />
	</button>
{/if}
