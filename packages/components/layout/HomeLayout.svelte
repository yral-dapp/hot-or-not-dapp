<home
  style="height:100vh;"
  class="relative block h-full w-full overflow-hidden text-white">
  <slot name="content" />
  <div class="absolute inset-x-0 top-0 z-[11]">
    <slot name="top" />
  </div>
  <div class="absolute inset-x-0 bottom-0 z-[10] max-h-16">
    <slot name="bottom-navigation" />
  </div>
</home>
