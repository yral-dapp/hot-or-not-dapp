<script lang="ts">
import IconButton from '$components/button/IconButton.svelte'
import { fade } from 'svelte/transition'
import { createEventDispatcher } from 'svelte'
import Icon from '$components/icon/Icon.svelte'

export let show = false
export let showCloseButton = false
export { exportStyle as style }
let exportStyle: any = ''
export { exportClass as class }
let exportClass: any = ''

const dispatch = createEventDispatcher<{ close: void }>()
</script>

{#if show}
  <div
    transition:fade={{ duration: 100 }}
    role="presentation"
    on:click={() => {
      show = false
      dispatch('close')
    }}
    class="absolute inset-0 z-[98] flex h-full w-full items-center justify-center bg-black/50">
    <div
      role="presentation"
      on:click={(e) => e.stopImmediatePropagation()}
      style={exportStyle}
      class="relative z-[99] mx-8 w-full max-w-sm rounded-lg bg-white p-10 {exportClass}">
      {#if showCloseButton}
        <IconButton
          iconName="close"
          iconClass="h-6 w-6 text-black/50"
          on:click={() => (show = false)}
          class="absolute right-2 top-2" />
      {/if}
      <slot />
    </div>
  </div>
{/if}
