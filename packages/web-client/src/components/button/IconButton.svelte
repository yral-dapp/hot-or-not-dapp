<script lang="ts">
import c from 'clsx';

export let disabled = false;
export let href = '';
export let prefetch = false;
export { exportClass as class };
let exportClass: string = '';

$: classes = c(
	'flex items-center select-none justify-center focus:outline-none',
	{
		'pointer-events-none': disabled
	},
	exportClass
);
</script>

{#if href && !prefetch}
	<a href="{href}" class="{classes}">
		<slot />
	</a>
{:else if href && prefetch}
	<a sveltekit:prefetch href="{href}" class="{classes}">
		<slot />
	</a>
{:else}
	<button on:click disabled="{disabled}" class="{classes}">
		<slot />
	</button>
{/if}
