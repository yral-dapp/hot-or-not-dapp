<script lang="ts">
import '../css/app.css'
import { onMount } from 'svelte'
import { authState } from '$lib/stores/auth'
import LoginPopup from '$lib/components/login/LoginPopup.svelte'
import Log from '$lib/utils/Log'
import { beforeNavigate } from '$app/navigation'
import { navigateBack, navigationHistory } from '$lib/stores/navigation'
import { registerEvent } from '$lib/components/analytics/GA.utils'
import userProfile from '$lib/stores/userProfile'
import { initializeAuthClient } from '$lib/helpers/auth'
import { page } from '$app/stores'
import { deferredPrompt } from '$lib/stores/deferredPrompt'
import NetworkStatus from '$lib/components/network-status/NetworkStatus.svelte'
import { removeSplashScreen } from '$lib/stores/popups'

const ignoredPaths = ['edit', 'lovers', 'post', 'speculations']

function registerServiceWorker() {
  if ($page.url.host.includes('t:')) return

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
}

let GA: any
async function initializeGA() {
  try {
    GA = (await import('$lib/components/analytics/GA.svelte')).default
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
  $navigateBack = null
  listenForUnhandledRejections()
  initializeAuthClient()
  registerServiceWorker()
  setTimeout(() => {
    initializeGA()
  }, 6000)
  removeSplashScreen()
})

beforeNavigate(({ from, to, type }) => {
  if (type === 'popstate') return

  if (to?.url.pathname) {
    $navigationHistory.push(to.url.pathname)
  }
  if (
    ignoredPaths.some((path) => from?.url.pathname.includes(path)) ||
    ignoredPaths.some((path) => to?.url.pathname.includes(path))
  )
    return
  $navigateBack = from?.url.pathname ?? null
})
</script>

<svelte:window
  on:appinstalled={() => {
    registerEvent('pwa_installed', {
      canister_id: $authState.userCanisterId,
      userId: $userProfile.principal_id,
    })
  }}
  on:beforeinstallprompt={(e) => {
    deferredPrompt.set(e)
  }} />

<NetworkStatus />

{#if $authState.showLogin}
  <LoginPopup />
{/if}

<div class="safe-bottom relative h-full w-full overflow-hidden overflow-y-auto">
  <slot />
</div>

{#if GA}
  <svelte:component this={GA} />
{/if}
