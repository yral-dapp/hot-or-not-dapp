<script lang="ts">
import Icon from '$components/icon/Icon.svelte'

export let show = false
export { exportClass as class }
let exportClass: any = ''
</script>

<button
  on:click={() => (show = !show)}
  class="rounded-sm border border-white/20 px-3 py-1 {exportClass}">
  <Icon
    name="caret-left"
    class="h-4 w-4 transition-transform {show ? 'rotate-90' : '-rotate-90'}" />
</button>
