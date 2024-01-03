import { browser } from '$app/environment'
import { replaceState } from '$app/navigation'
import { registerPageView } from '@hnn/components/analytics/GA.utils'
import type { PostPopulated } from '$lib/helpers/feed'
import { navigateBack } from '$lib/stores/navigation'
import { playerState } from '$lib/stores/playerState'

export function updateURL(post?: PostPopulated) {
  if (!post || !browser) return
  const url = post.publisher_canister_id + '@' + post.post_id
  navigateBack.set(url)
  playerState.update((o) => ({ ...o, currentFeedUrl: url }))
  replaceState(url, '')
  registerPageView(new URL(window.location.href))
}
