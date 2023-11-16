import {
  query,
  collection,
  getDocs,
  limit,
  QueryDocumentSnapshot,
  orderBy,
} from 'firebase/firestore'
import type { CollectionName, UpDownPost } from '../db/db.types'
import { getDb } from '$lib/db'

export async function getVideos(lastRef?: QueryDocumentSnapshot) {
  try {
    console.log({ lastRef })
    const videos: UpDownPost[] = []
    const db = getDb()
    const q = query(
      collection(db, 'ud-videos' as CollectionName),
      orderBy('created_at', 'desc'),
      limit(50),
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      return { ok: true, videos, more: false }
    }
    snapshot.forEach((doc) =>
      videos.push({ ...doc.data(), id: doc.id } as UpDownPost),
    )
    return {
      ok: true,
      videos,
      lastRef: snapshot.docs[snapshot.docs.length - 1],
      more: true,
    }
  } catch (e) {
    console.log('Error fetching videos', e)
    return { ok: false }
  }
}
