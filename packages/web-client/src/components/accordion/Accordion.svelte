<script lang="ts">
export let expanded = false
</script>

<accordion class="flex w-full flex-col rounded-lg bg-white/10 p-3">
  <div class="flex items-center justify-between pr-1">
    <slot name="title" />

    <button
      on:click
      class="ml-2 shrink-0 -translate-y-[2px] text-2xl text-primary">
      {#if expanded}
        -
      {:else}
        +
      {/if}
    </button>
  </div>
  {#if $$slots.body && expanded}
    <slot name="body" />
  {/if}
</accordion>
