<script lang="ts">
import IconButton from '../button/IconButton.svelte'
import { fade } from 'svelte/transition'
import { createEventDispatcher } from 'svelte'

export let show = false
export let showCloseButton = false

const dispatch = createEventDispatcher<{ close: void }>()
</script>

{#if show}
  <div
    transition:fade={{ duration: 100 }}
    role="presentation"
    on:click={() => (show = false)}
    class="absolute inset-0 z-[98] flex h-full w-full items-center justify-center bg-black/80">
    {#if showCloseButton}
      <IconButton
        iconName="close"
        iconClass="h-8 w-8 text-white"
        on:click={(e) => {
          e.stopImmediatePropagation()
          dispatch('close')
          show = false
        }}
        class="absolute right-3 top-3" />
    {/if}
    <div
      class="z-[100] contents"
      role="presentation"
      on:click={(e) => e.stopImmediatePropagation()}>
      <slot />
    </div>
  </div>
{/if}
