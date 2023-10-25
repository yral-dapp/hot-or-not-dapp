<script lang="ts">
import c from 'clsx'

export let type: 'primary' | 'secondary' = 'primary'
export let disabled = false
export let href = ''
export let preload = false
export { exportClass as class }
let exportClass: any = ''

$: classes = c(
  'flex items-center duration-200 transition-all rounded-full !select-none justify-center focus:outline-none px-4 py-3 font-semibold text-white',
  {
    'bg-orange-500 shadow-button-primary focus:bg-orange-700':
      type === 'primary' && !disabled,
    'bg-orange-900 border-0': type === 'primary' && disabled,
    'border-white/40 focus:bg-white/20 border-2 bg-transparent':
      type === 'secondary' && !disabled,
    'border-white/10 bg-zinc-600': type === 'secondary' && disabled,
    'text-zinc-400 pointer-events-none': disabled,
  },
  exportClass,
)
</script>

{#if href && !preload}
  <a {href} class={classes}>
    <slot />
  </a>
{:else if href && preload}
  <a data-sveltekit-preload-data="tap" {href} class={classes}>
    <slot />
  </a>
{:else}
  <button on:click {disabled} class={classes}>
    <slot />
  </button>
{/if}
