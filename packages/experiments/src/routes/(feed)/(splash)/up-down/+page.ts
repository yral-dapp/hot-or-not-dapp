export const ssr = false

import { getDb } from '$lib/db'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import type { CollectionName, UpDownPost } from '$lib/db/db.types'

export const load: PageLoad = async () => {
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
    throw redirect(307, '/up-down/no-videos')
  }
  const data = res.docs[0].data() as UpDownPost

  if (data?.ouid && data?.oid) {
    throw redirect(307, `/up-down/${data.ouid}@${data.oid}`)
  } else {
    throw redirect(307, '/up-down/no-videos')
  }
}
