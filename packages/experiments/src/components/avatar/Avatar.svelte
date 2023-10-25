<script lang="ts">
export let src = ''
export { exportClass as class }
let exportClass: any = ''
</script>

<img
  alt="Avatar"
  {src}
  class="rounded-full border-2 border-white object-cover object-center {exportClass}" />
