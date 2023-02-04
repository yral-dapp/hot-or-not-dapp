<script lang="ts">
import '../css/app.css'
import { onMount } from 'svelte'
import { authState } from '$stores/auth'
import navigateBack from '$stores/navigateBack'
import Ga, { registerEvent } from '$components/seo/GA.svelte'
import userProfile from '$stores/userProfile'
import { deferredPrompt } from '$stores/deferredPrompt'
import NetworkStatus from '$components/network-status/NetworkStatus.svelte'
import { beforeNavigate } from '$app/navigation'
import { init } from '$lib/utils/sentry'
import { page } from '$app/stores'
import LoginPopup from '$components/login/LoginPopup.svelte'
import PartyTown from '$components/partytown/PartyTown.svelte'
import { browser } from '$app/environment'
import GoSquared from '$components/seo/GoSquared.svelte'

const ignoredPaths = ['edit', 'lovers', 'post']

beforeNavigate(({ from, to }) => {
  if (
    ignoredPaths.some((path) => from?.url.pathname.includes(path)) ||
    ignoredPaths.some((path) => to?.url.pathname.includes(path))
  )
    return
  $navigateBack = from?.url.pathname ?? null
})

function registerServiceWorker(environment: 'localDev' | 'production') {
  if (environment === 'localDev') return
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
}

async function initAuthClient() {
  const { initializeAuthClient } = await import('$lib/helpers/auth')
  initializeAuthClient()
}

onMount(() => {
  $navigateBack = null
  const env = $page.url.host.includes('t:') ? 'localDev' : 'production'
  init(env)
  registerServiceWorker(env)
  browser && initAuthClient()
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

<div class="safe-bottom relative h-full w-full overflow-hidden overflow-y-auto">
  <slot />
</div>

<NetworkStatus />

<alpha-ribbon
  class="pointer-events-none absolute -right-10 top-2 z-[50] flex w-28 rotate-45 items-center justify-center overflow-hidden bg-primary py-0.5 px-1 text-[0.5rem] font-bold uppercase text-white opacity-60">
  Alpha
</alpha-ribbon>

{#if $authState.showLogin}
  <LoginPopup />
{/if}

<PartyTown />

<Ga />

<GoSquared />
