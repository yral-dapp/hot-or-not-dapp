<script lang="ts">
import c from 'clsx';

export let disabled = false;
export let href = '';
export let prefetch = false;
export let ariaLabel = '';
export { exportClass as class };
let exportClass: string = '';

const style = '-webkit-tap-highlight-color: transparent;';

$: classes = c(
	'flex items-center select-none justify-center focus:outline-none ',
	{
		'pointer-events-none opacity-60 grayscale': disabled
	},
	exportClass
);
</script>

{#if href && !prefetch && !disabled}
	<a aria-label="{ariaLabel}" style="{style}" on:click href="{href}" class="{classes}">
		<slot />
	</a>
{:else if href && prefetch && !disabled}
	<a
		aria-label="{ariaLabel}"
		style="{style}"
		on:click
		data-sveltekit-prefetch
		href="{href}"
		class="{classes}">
		<slot />
	</a>
{:else}
	<button aria-label="{ariaLabel}" style="{style}" on:click disabled="{disabled}" class="{classes}">
		<slot />
	</button>
{/if}
