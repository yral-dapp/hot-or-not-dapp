import { getDb } from '$lib/db'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import type { CollectionName, UpDownPost } from '$lib/db/db.types'

export const loadFirstVideo: PageLoad = async () => {
  // const cachedVideos = await getWatchedVideosFromCache('watch')
  // if (cachedVideos.length) {
  //   throw redirect(
  //     307,
  //     `/up-down/${cachedVideos[0].publisher_canister_id}@${cachedVideos[0].post_id}`,
  //   )
  // }
  const db = getDb()
  const q = query(collection(db, 'ud-videos' as CollectionName), limit(1))
  const res = await getDocs(q)
  if (res.empty) {
    redirect(307, '/up-down/no-videos');
  }
  const data = res.docs[0].data() as UpDownPost

  if (data) {
    redirect(307, `/up-down/${res.docs[0].id}`);
  } else {
    redirect(307, '/up-down/no-videos');
  }
}
