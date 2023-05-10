import { writable, get } from 'svelte/store'
import { persisted } from 'svelte-local-storage-store'

export const showOnboardingPopup = persisted('hot-or-not-ob', true)

export const splashScreenPopup = writable<{
  show: boolean
  shown: boolean
}>({
  show: true,
  shown: false,
})

export const showAirdropPopup = writable<boolean>(true)

let splashScreenTimeOut: NodeJS.Timeout

export function hideSplashScreen(timeoutMs: number = 2000) {
  if (get(splashScreenPopup).shown) return
  if (splashScreenTimeOut) clearTimeout(splashScreenTimeOut)
  splashScreenTimeOut = setTimeout(() => {
    splashScreenPopup.set({ show: false, shown: true })
  }, timeoutMs)
}
