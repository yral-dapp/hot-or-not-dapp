<script lang="ts">
import c from 'clsx';

export let type: 'primary' | 'secondary' = 'primary';
export let disabled = false;
export let href = '';
export let prefetch = false;
export { exportClass as class };
let exportClass: any = '';

const style = '-webkit-tap-highlight-color: transparent;';

$: classes = c(
	'flex items-center duration-200 transition-all rounded-full !select-none justify-center focus:outline-none px-4 py-3 font-semibold text-white',
	{
		'bg-orange-500 shadow-button-primary focus:bg-orange-700': type === 'primary' && !disabled,
		'bg-zinc-800': type === 'primary' && disabled,
		'border-2 bg-transparent': type === 'secondary',
		'border-white/40 focus:bg-white/20': type === 'secondary' && !disabled,
		'border-white/10': type === 'secondary' && disabled,
		'text-zinc-500 pointer-events-none': disabled
	},
	exportClass
);
</script>

{#if href && !prefetch}
	<a style="{style}" href="{href}" class="{classes}">
		<slot />
	</a>
{:else if href && prefetch}
	<a style="{style}" sveltekit:prefetch href="{href}" class="{classes}">
		<slot />
	</a>
{:else}
	<button on:click disabled="{disabled}" style="{style}" class="{classes}">
		<slot />
	</button>
{/if}
