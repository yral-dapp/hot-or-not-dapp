<script lang="ts">
import SplashScreen from '$components/layout/SplashScreen.svelte'
import AirdropPopup from '$components/popup/AirdropPopup.svelte'
import { splashScreenPopup } from '$stores/popups'
</script>

<SplashScreen />
{#if !$splashScreenPopup.show}
  <AirdropPopup />
{/if}

<slot />
