<script lang="ts">
import type { IconName } from './icon.type'

export let name: IconName
export { exportClass as class }
let exportClass: any = ''
</script>

<svg class={exportClass}>
  <use xlink:href="/icons.sprite.svg#{name}" />
</svg>
