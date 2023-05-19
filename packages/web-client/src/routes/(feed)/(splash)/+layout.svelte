<script lang="ts">
import SplashScreen from '$components/layout/SplashScreen.svelte'
import AirdropPopupOnlyCountdown from '$components/popup/AirdropPopupOnlyCountdown.svelte'
import { splashScreenPopup } from '$stores/popups'
</script>

<SplashScreen />
{#if !$splashScreenPopup.show}
  <AirdropPopupOnlyCountdown />
{/if}

<slot />
