<hot-or-not-layout
  style="height: 100vh;"
  class="relative block h-full w-full overflow-hidden text-white">
  <slot name="content" />
  <div class="absolute inset-x-0 top-0 z-[5]">
    <slot name="top" />
  </div>
  <div class="pointer-events-none absolute inset-x-0 bottom-0 z-[5] max-h-48">
    <slot name="bottom-navigation" />
  </div>
</hot-or-not-layout>
