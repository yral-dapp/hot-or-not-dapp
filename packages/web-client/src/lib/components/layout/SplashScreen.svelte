<script lang="ts">
import { fade } from 'svelte/transition'
import { hideSplashScreen, splashScreenPopup } from '$lib/stores/popups'
import { onMount } from 'svelte'
import Icon from '$lib/components/icon/Icon.svelte'

onMount(() => {
  hideSplashScreen(5000)
})
</script>

{#if $splashScreenPopup.show}
  <splash-screen
    out:fade={{ duration: 500 }}
    class="spacy-y-8 absolute z-[15] flex h-full w-full flex-col items-center justify-center space-y-10 bg-black">
    <Icon name="hot-or-not-logo" class="h-56 w-56" />
    <Icon name="loading" class="h-5 w-5 animate-spin-slow opacity-50" />
  </splash-screen>
{/if}
