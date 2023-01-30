<script lang="ts">
export { exportClass as class }
let exportClass: any = ''
export let filled = false
</script>

<svg
  class={exportClass}
  viewBox="0 0 33 31"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_f_9_14)">
    <path
      d="M16.5 27C17.125 27 29 20.6114 29 11.6672C29 7.19516 25.875 4.05629 22.125 4.00082C20.25 3.97309 18.375 4.63896 16.5 7.19451C14.625 4.63896 12.7176 4.00082 10.875 4.00082C7.125 4.00082 4 7.19516 4 11.6672C4 20.6114 15.875 27 16.5 27Z"
      fill="black"
      fill-opacity="0.3" />
  </g>
  {#if filled}
    <path
      d="M17.5 27C18.125 27 30 20.6114 30 11.6672C30 7.19516 26.875 4.05629 23.125 4.00082C21.25 3.97309 19.375 4.63896 17.5 7.19451C15.625 4.63896 13.7176 4.00082 11.875 4.00082C8.125 4.00082 5 7.19516 5 11.6672C5 20.6114 16.875 27 17.5 27Z"
      fill="url(#paint0_linear_9_14)"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round" />
  {:else}
    <path
      d="M16.5 27C17.125 27 29 20.6114 29 11.6672C29 7.19516 25.875 4.05629 22.125 4.00082C20.25 3.97309 18.375 4.63896 16.5 7.19451C14.625 4.63896 12.7176 4.00082 10.875 4.00082C7.125 4.00082 4 7.19516 4 11.6672C4 20.6114 15.875 27 16.5 27Z"
      fill="currentColor" />
  {/if}
  <defs>
    <filter
      id="filter0_f_9_14"
      x="0"
      y="0"
      width="33"
      height="31"
      filterUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix" />
      <feBlend
        mode="normal"
        in="SourceGraphic"
        in2="BackgroundImageFix"
        result="shape" />
      <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_9_14" />
    </filter>
    <linearGradient
      id="paint0_linear_9_14"
      x1="17.5"
      y1="4"
      x2="17.5"
      y2="27"
      gradientUnits="userSpaceOnUse">
      <stop stop-color="#F74909" />
      <stop offset="1" stop-color="#FEBE48" />
    </linearGradient>
  </defs>
</svg>
