<script lang="ts">
import iconsMap from './iconsMap';

export let icon: keyof typeof iconsMap;
export { exportClass as class };
let exportClass: any = 'fill-white';
</script>

<svg width="24" height="24" viewBox="0 0 24 24" class="{exportClass}">
	{@html iconsMap[icon]}
</svg>
