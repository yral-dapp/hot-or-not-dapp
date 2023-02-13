import type { PostPopulated } from '$lib/helpers/feed'
import { getThumbnailUrl } from './cloudflare'

export type VideoViewReport = {
  progress: number
  videoId: bigint
  canisterId: string
  profileId: string
  count: number
  score: bigint
}

export function filterPostsUniquely(
  source: PostPopulated[],
  newPosts: PostPopulated[],
): PostPopulated[] {
  return newPosts.filter((o) => {
    if (
      source.findIndex(
        (v) =>
          (v.post_id === o.post_id &&
            v.publisher_canister_id === o.publisher_canister_id) ||
          v.video_uid === o.video_uid,
      ) > -1
    ) {
      return false
    } else return true
  })
}

export function updateMetadata(video?: PostPopulated) {
  if (!video) return
  if (!('mediaSession' in navigator)) return
  navigator.mediaSession.metadata = new MediaMetadata({
    title: video.description + '| Hot or Not',
    artist:
      video.created_by_display_name[0] ||
      video.created_by_unique_user_name[0] ||
      '',
    album: 'Hot or Not',
    artwork: [{ src: getThumbnailUrl(video.video_uid), type: 'image/png' }],
  })
}
