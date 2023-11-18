import { registerPageView } from '$components/analytics/GA.utils'
import type { UpDownPost } from '$lib/db/db.types'
import { playerState } from '$stores/playerState'

export function updateURL(post?: UpDownPost) {
  if (!post) return
  const url = post.id
  playerState.update((o) => ({ ...o, currentFeedUrl: url }))
  window.history.replaceState('', '', url)
  registerPageView(new URL(window.location.href))
}
