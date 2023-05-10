import { writable, get } from 'svelte/store'

export const splashScreenPopup = writable<{
  show: boolean
  shown: boolean
}>({
  show: true,
  shown: false,
})

let splashScreenTimeOut: NodeJS.Timeout

export function hideSplashScreen(timeoutMs: number = 2000) {
  if (get(splashScreenPopup).shown) return
  if (splashScreenTimeOut) clearTimeout(splashScreenTimeOut)
  splashScreenTimeOut = setTimeout(() => {
    splashScreenPopup.set({ show: false, shown: true })
  }, timeoutMs)
}
