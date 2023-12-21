import { replaceState } from '$app/navigation'
import { registerPageView } from '$lib/components/analytics/GA.svelte'
import type { PostPopulated } from '$lib/helpers/feed'
import { navigateBack } from '$lib/stores/navigation'
import { playerState } from '$lib/stores/playerState'

export function updateURL(post?: PostPopulated) {
  if (!post) return
  const url = post.publisher_canister_id + '@' + post.post_id
  navigateBack.set(url)
  playerState.update((o) => ({ ...o, currentFeedUrl: url }))
  replaceState(url, '')
  registerPageView(new URL(window.location.href))
}
