<script lang="ts">
import IconButton from '../button/IconButton.svelte'
import OverlayPopup from './OverlayPopup.svelte'

export let show = false
export let showCloseButton = false
export { exportStyle as style }
let exportStyle: any = ''
export { exportClass as class }
let exportClass: any = ''
</script>

<OverlayPopup bind:show on:close>
  <div
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
</OverlayPopup>
