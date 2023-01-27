<script lang="ts">
export let disabled = false
export let placeholder = ''
export let value: string | number = ''
export let rows: number = 4
export { exportClass as class }

let exportClass: any = ''
</script>

<textarea
  {disabled}
  {placeholder}
  {rows}
  bind:value
  on:input
  on:change
  on:focus
  on:blur
  class="w-full border-none py-3 px-4 focus:ring-transparent {exportClass}" />
