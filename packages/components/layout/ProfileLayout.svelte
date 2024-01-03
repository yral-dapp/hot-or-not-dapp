<profile-layout
  style="height: 100vh;"
  class="relative flex h-full w-full flex-col overflow-hidden text-white">
  <div
    class="relative z-[2] flex h-12 w-full items-center justify-center bg-black py-8 shadow-xl shadow-black/50">
    <div class="absolute left-4 top-4">
      <slot name="top-left" />
    </div>
    <slot name="top-center" />
    <div class="absolute right-4 top-4">
      <slot name="top-right" />
    </div>
  </div>
  <slot class="w-full" name="content" />
</profile-layout>
