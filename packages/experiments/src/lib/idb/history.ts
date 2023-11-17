import type { UpDownPost } from '$lib/db/db.types'
import type { IDBStores } from './idb'

export type UpDownPostHistory = UpDownPost & {
  watched_at: number
}

export async function updatePostInWatchHistory(
  store: IDBStores,
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
    await idb.set(store, post.id, postHistory)
  } catch (e) {
    console.error('Error while accessing IDB', {
      error: e,
      from: 'updatePostInWatchHistory',
      type: 'idb',
    })
  }
}
