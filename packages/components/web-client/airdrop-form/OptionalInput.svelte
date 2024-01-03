<script>
import Input from '$lib/components/input/Input.svelte'

export let checked = false
export let value = ''
export let checkboxLabel
export let inputLabel
export let inputPlaceholder
</script>

<div class="flex flex-col gap-3 rounded-md bg-white/10 p-3">
  <label class="flex items-center gap-2 text-sm text-white">
    <input
      bind:checked
      type="checkbox"
      class="h-4 w-4 rounded border-2 border-white bg-transparent text-primary focus:ring-0" />
    {checkboxLabel}
  </label>
  {#if checked}
    <div class="flex flex-col gap-1">
      <span class="text-sm text-white">
        {inputLabel}
        <sub class="align-super text-primary">*</sub>
      </span>
      <Input
        bind:value
        placeholder={inputPlaceholder}
        class="flex-1 rounded-md border-0 bg-white/10 p-2 text-sm outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0" />
    </div>
  {/if}
</div>
