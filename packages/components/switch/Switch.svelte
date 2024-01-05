<script lang="ts">
export let checked = false
export let disabled = false
</script>

<button
  {disabled}
  on:click={() => (checked = !checked)}
  class="flex h-[1.4rem] w-10 items-center justify-start rounded-full transition-all duration-500
  {checked ? 'bg-white' : 'bg-transparent ring-1 ring-white'}
  {disabled ? 'opacity-50' : 'opacity-100'}">
  <div
    class="h-4 w-4 rounded-full transition-all duration-500
    {checked ? 'translate-x-5 bg-primary' : 'translate-x-1 bg-white'} " />
</button>
