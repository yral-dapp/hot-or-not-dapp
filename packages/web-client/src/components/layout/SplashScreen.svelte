<script lang="ts">
import { fade } from 'svelte/transition'
import { hideSplashScreen, splashScreenPopup } from '$stores/popups'
import HotorNotIcon from '$components/icons/HotorNotIcon.svelte'
import { onMount } from 'svelte'
import Icon from '$components/icon/Icon.svelte'

onMount(() => {
  hideSplashScreen(5000)
})
</script>

{#if $splashScreenPopup.show}
  <splash-screen
    out:fade|local={{ duration: 500 }}
    class="spacy-y-8 absolute z-[15] flex h-full w-full flex-col items-center justify-center space-y-10 bg-black">
    <HotorNotIcon class="h-56" />
    <Icon name="loading" class="h-5 w-5 animate-spin-slow opacity-50" />
  </splash-screen>
{/if}
