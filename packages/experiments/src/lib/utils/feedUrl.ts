import { registerPageView } from '$components/analytics/GA.svelte'
import type { UpDownPost } from '$lib/helpers/db.type'
import { playerState } from '$stores/playerState'

export function updateURL(post?: UpDownPost) {
  if (!post) return
  const url = post.ouid + '@' + post.oid
  playerState.update((o) => ({ ...o, currentFeedUrl: url }))
  window.history.replaceState('', '', url)
  registerPageView(new URL(window.location.href))
}
