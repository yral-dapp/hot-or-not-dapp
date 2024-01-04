<script lang="ts">
import '@hnn/components/tailwind.css'
import NetworkStatus from '@hnn/components/network-status/NetworkStatus.svelte'
import { registerEvent } from '@hnn/components/analytics/GA.utils'
import { onMount } from 'svelte'
import { authState } from '$lib/stores/auth'
import userProfile from '$lib/stores/userProfile'
import { removeSplashScreen } from '$lib/stores/popups'
import Log from '$lib/utils/Log'
import { page } from '$app/stores'
import { deferredPrompt } from '$lib/stores/deferredPrompt'
import { initDb } from '$lib/db'
import { browser } from '$app/environment'
import LoginPopup from '$lib/components/auth/LoginPopup.svelte'

function registerServiceWorker() {
  if (!browser) return
  if ($page.url.host.includes('t:')) return

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
}

let GA: any
function initializeGA() {
  try {
    import('@hnn/components/analytics/GA.svelte').then((d) => {
      GA = d.default
      console.info('loaded GA')
    })
  } catch (_) {
    Log('warn', 'Could not load GA')
  }
}

function listenForUnhandledRejections() {
  window.addEventListener('unhandledrejection', (e) => {
    // Handle app-crash level errors here
    Log('error', 'Unhandled exception', {
      from: 'listenForUnhandledRejections',
      e,
    })
  })
}

onMount(() => {
  initDb()
  listenForUnhandledRejections()
  registerServiceWorker()
  setTimeout(() => {
    initializeGA()
  }, 6000)
  removeSplashScreen()
})
</script>

<svelte:window
  on:appinstalled={() => {
    registerEvent('pwa_installed', {
      userId: $authState.userId,
      email: $userProfile.email,
    })
  }}
  on:beforeinstallprompt={(e) => {
    deferredPrompt.set(e)
  }} />

<NetworkStatus />

<div class="safe-bottom relative h-full w-full overflow-hidden overflow-y-auto">
  <slot />
</div>

{#if $authState.showLogin}
  <LoginPopup />
{/if}

{#if GA}
  <svelte:component this={GA} tagId="G-PPE5XD2VKV" pageUrl={$page?.url?.href} />
{/if}
