<script lang="ts">
import c from 'clsx';

export let type: 'primary' | 'secondary' = 'primary';
export let disabled = false;
export let href = '';
export { exportClass as class };
let exportClass: any = '';

const classes = c(
	'flex items-center rounded-full select-none justify-center px-4 py-3 font-semibold text-white',
	{
		'bg-orange-500 shadow-button-primary': type === 'primary' && !disabled,
		'bg-zinc-800': type === 'primary' && disabled,
		'border-2 bg-transparent': type === 'secondary',
		'border-white/40': type === 'secondary' && !disabled,
		'border-white/10': type === 'secondary' && disabled,
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
