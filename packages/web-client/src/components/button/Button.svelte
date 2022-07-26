<script lang="ts">
import c from 'clsx';

export let type: 'primary' | 'secondary' = 'primary';
export let disabled = false;
export let href = '';
export { exportClass as class };
let exportClass: any = '';

const classes = c(
	'flex items-center rounded-full justify-center px-4 py-3 font-bold text-white',
	{
		'bg-orange-500 shadow-button-primary': type === 'primary' && !disabled,
		'bg-gray-500': type === 'primary' && disabled,
		'border-2 border-white bg-transparent': type === 'secondary' && !disabled,
		'border-2 border-white/20 bg-transparent text-gray-500': type === 'secondary' && disabled
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
