import { writable, get } from 'svelte/store'
import { persisted } from 'svelte-local-storage-store'
import { browser } from '$app/environment'

export const showOnboardingPopup = persisted('experiments-ob', true)

export const splashScreenPopup = writable<{
  show: boolean
  shown: boolean
}>({
  show: true,
  shown: false,
})

export function removeSplashScreen() {
  if (!browser) return
  const el = document.querySelector('splash-screen')
  el?.remove()
}

let splashScreenTimeOut: NodeJS.Timeout

export function hideSplashScreen(timeoutMs: number = 2000) {
  if (get(splashScreenPopup).shown) return
  if (splashScreenTimeOut) clearTimeout(splashScreenTimeOut)
  splashScreenTimeOut = setTimeout(() => {
    splashScreenPopup.set({ show: false, shown: true })
  }, timeoutMs)
}
