<script lang="ts">
import SplashScreen from '$components/layout/SplashScreen.svelte'
import AirdropPopup from '$components/popup/AirdropPopup.svelte'
import { showAirdropPopup, splashScreenPopup } from '$stores/popups'
</script>

<SplashScreen />
{#if $showAirdropPopup}
  <AirdropPopup />
{/if}

<slot />
