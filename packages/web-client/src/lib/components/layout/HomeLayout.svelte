<script lang="ts">
import { browser } from '$app/environment'
import { playerState } from '$lib/stores/playerState'

export let testMode = false

$: testClasses = testMode ? 'border-2 border-white/30' : ''
</script>

<home
  style="height:100vh;"
  class="relative block h-full w-full overflow-hidden text-white">
  <slot name="content" />
  <div class="absolute inset-x-0 top-0 z-[11] {testClasses}">
    <slot name="top" />
  </div>
  <div class="absolute inset-x-0 bottom-0 z-[10] max-h-16 {testClasses}">
    <slot name="bottom-navigation" />
  </div>
</home>
