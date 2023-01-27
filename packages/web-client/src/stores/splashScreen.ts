import { writable, get } from 'svelte/store'

export const splashScreen = writable<{
  show: boolean
  shown: boolean
}>({
  show: true,
  shown: false,
})

let timeout

export function hideSplashScreen(timeoutMs: number = 2000) {
  if (get(splashScreen).shown) return
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    splashScreen.set({ show: false, shown: true })
  }, timeoutMs)
}
