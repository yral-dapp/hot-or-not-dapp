<script lang="ts">
import Icon from '$lib/components/icon/Icon.svelte'
import type { IconName } from '$lib/components/icon/icon.type'
import c from 'clsx'

export let disabled = false
export let iconName: IconName
export let iconClass: string
export let href = ''
export let title = ''
export let preload = false
export let ariaLabel = ''
export { exportClass as class }
let exportClass: string = ''

const style = '-webkit-tap-highlight-color: transparent;'

$: classes = c(
  'flex items-center select-none justify-center focus:outline-none ',
  {
    'pointer-events-none opacity-60 grayscale': disabled,
  },
  exportClass,
)
</script>

{#if href && !preload && !disabled}
  <a aria-label={ariaLabel} {style} on:click {href} class={classes}>
    <Icon name={iconName} class={iconClass} />
    <slot />
  </a>
{:else if href && preload && !disabled}
  <a
    aria-label={ariaLabel}
    {style}
    on:click
    data-sveltekit-preload-data="tap"
    {href}
    class={classes}>
    <Icon name={iconName} class={iconClass} />
    <slot />
  </a>
{:else}
  <button
    {title}
    type="button"
    aria-label={ariaLabel}
    {style}
    on:click
    {disabled}
    class={classes}>
    <Icon name={iconName} class={iconClass} />
    <slot />
  </button>
{/if}
