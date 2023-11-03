import type { DBStores } from '$lib/idb/idb'
import Log from '$lib/utils/Log'
import type { UpDownPost } from './db.type'

export interface UpDownPostHistory extends UpDownPost {
  watched_at: number
}

export async function updatePostInWatchHistory(
  store: DBStores,
  post: UpDownPost,
  update?: Partial<UpDownPost>,
) {
  if (!post) return
  const postHistory: UpDownPostHistory = {
    ...post,
    ...update,
    watched_at: Date.now(),
  }
  try {
    const idb = (await import('$lib/idb')).idb

    await idb.set(store, post.ouid + '@' + post.oid, postHistory)
  } catch (e) {
    Log('error', 'Error while accessing IDB', {
      error: e,
      from: 'feed.updatePostInWatchHistory',
      type: 'idb',
    })
  }
}
