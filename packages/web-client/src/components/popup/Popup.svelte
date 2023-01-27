<script lang="ts">
import IconButton from '$components/button/IconButton.svelte'
import CloseIcon from '$components/icons/CloseIcon.svelte'
import { fade } from 'svelte/transition'
import { createEventDispatcher } from 'svelte'

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
    transition:fade|local={{ duration: 100 }}
    on:keyup
    on:click={() => {
      show = false
      dispatch('close')
    }}
    class="absolute inset-0 z-[98] flex h-full w-full items-center justify-center bg-black/50">
    <div
      on:keyup
      on:click={(e) => e.stopImmediatePropagation()}
      style={exportStyle}
      class="relative z-[99] mx-8 w-full max-w-sm rounded-lg bg-white p-10 {exportClass}">
      {#if showCloseButton}
        <IconButton
          on:click={() => (show = false)}
          class="absolute top-2 right-2">
          <CloseIcon class="h-6 w-6 text-black/50" />
        </IconButton>
      {/if}
      <slot />
    </div>
  </div>
{/if}
