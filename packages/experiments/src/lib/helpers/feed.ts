import {
  query,
  collection,
  getDocs,
  limit,
  QueryDocumentSnapshot,
  startAt,
} from 'firebase/firestore/lite'
import type { CollectionName, UpDownPost } from './db.type'
import { db } from '$lib/db'

export async function getVideos(lastRef?: QueryDocumentSnapshot) {
  try {
    const videos: UpDownPost[] = []
    const q = query(
      collection(db, 'ud-videos' as CollectionName),
      limit(30),
      startAt(lastRef),
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) {
      return { ok: true, videos, more: false }
    }
    snapshot.forEach((doc) => videos.push(doc.data() as UpDownPost))
    return {
      ok: true,
      videos,
      lastRef: snapshot.docs[snapshot.docs.length - 1],
      more: true,
    }
  } catch (e) {
    return { ok: false }
  }
}

export async function toggleLike(postId: string) {
  console.log('toggle like')
}
