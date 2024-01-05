import { browser } from '$app/environment'

export function isiPhone() {
  if (!browser) return false
  return /iPhone|iPod|iPad/.test(navigator.platform)
}
