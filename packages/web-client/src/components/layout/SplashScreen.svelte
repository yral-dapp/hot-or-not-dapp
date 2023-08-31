<script lang="ts">
import { hideSplashScreen } from '$stores/popups'
import { onMount } from 'svelte'

onMount(() => {
  hideSplashScreen(5000)
})
</script>
