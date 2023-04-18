<script lang="ts">
import clickOutside from '$lib/utils/clickOutside'

export let text = ''
export let position: 'left' | 'right' | 'middle'

const positionClass = {
  left: 'left-0',
  right: 'right-0',
  middle: '',
}

let show = false
</script>

<tooltip
  use:clickOutside
  on:clickOutside={() => (show = false)}
  class="relative flex w-min cursor-pointer">
  {#if show}
    <div
      class="absolute w-min -translate-y-14 rounded-md bg-white p-2 px-4 drop-shadow-md
      {positionClass[position]}">
      <span class="whitespace-nowrap text-black">
        {text}
      </span>
      <!-- <div
        class="absolute inset-0 flex items-end
        {caretClass[position]}">
        <svg
          class="translate-y-2"
          width="16"
          height="14"
          viewBox="0 0 16 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7.13397 13.5C7.51887 14.1667 8.48113 14.1667 8.86603 13.5L15.7942 1.5C16.1791 0.833334 15.698 0 14.9282 0H1.0718C0.301997 0 -0.179129 0.833333 0.205771 1.5L7.13397 13.5Z"
            fill="white" />
        </svg>
      </div> -->
    </div>
  {/if}
  <div role="presentation" on:click={() => (show = !show)}>
    <slot />
  </div>
</tooltip>
