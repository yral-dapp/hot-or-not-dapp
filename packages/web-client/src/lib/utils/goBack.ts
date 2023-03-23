import { goto } from '$app/navigation'
import { navigationHistory } from '$stores/navigation'
import { get } from 'svelte/store'

export default function (goBackTo?: string | null, replaceState?: boolean) {
  const navHistory = get(navigationHistory)
  if (navHistory.length === 0 && goBackTo) {
    goto(goBackTo, { replaceState })
  } else {
    history.back()
    navHistory.pop()
    navigationHistory.set(navHistory)
  }
}
