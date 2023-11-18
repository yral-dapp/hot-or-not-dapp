<script lang="ts">
import '../css/app.css'
import { onMount } from 'svelte'
import { authState } from '$stores/auth'
import Log from '$lib/utils/Log'
import userProfile from '$stores/userProfile'
import { page } from '$app/stores'
import { deferredPrompt } from '$stores/deferredPrompt'
import NetworkStatus from '$components/network-status/NetworkStatus.svelte'
import { initDb } from '$lib/db'
import { browser } from '$app/environment'
import LoginPopup from '$components/auth/LoginPopup.svelte'
import { registerEvent } from '$components/analytics/GA.utils'

function registerServiceWorker() {
  if (!browser) return
  if ($page.url.host.includes('t:')) return

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
}

let GA: any
async function initializeGA() {
  try {
    GA = (await import('$components/analytics/GA.svelte')).default
    console.info('loaded GA')
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
  initializeGA()
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
  <svelte:component this={GA} />
{/if}
