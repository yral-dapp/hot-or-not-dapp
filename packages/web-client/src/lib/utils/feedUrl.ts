import { registerPageView } from '$components/seo/GA.svelte'
import type { PostPopulated } from '$lib/helpers/feed'
import navigateBack from '$stores/navigateBack'
import { playerState } from '$stores/playerState'

export function updateURL(post?: PostPopulated) {
  if (!post) return
  const url = post.publisher_canister_id + '@' + post.post_id
  navigateBack.set(url)
  playerState.update((o) => ({ ...o, currentFeedUrl: url }))
  window.history.replaceState('', '', url)
  registerPageView(new URL(window.location.href))
}
