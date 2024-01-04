<script lang="ts">
export let testMode = false

$: testClasses = testMode ? 'border-2 border-white/30' : ''
</script>

<home
  style="height: 100dvh;"
  class="relative block h-full w-full overflow-hidden text-white">
  <slot name="content" />
  <div class="absolute inset-x-0 top-4 z-[11] {testClasses}">
    <slot name="top" />
  </div>
  <div class="absolute inset-x-0 bottom-0 z-[10] max-h-16 {testClasses}">
    <slot name="bottom-navigation" />
  </div>
</home>
