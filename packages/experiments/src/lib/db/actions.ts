import type { VideoRef } from './db.types'
import { getHeaders } from './db.utils'
import { BACKEND_HOST } from './index'

export async function toggleLike(video: VideoRef) {
  await fetch(`${BACKEND_HOST}/feed/like`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      ...video,
    }),
  })
}

export async function shareVideo(video: VideoRef) {
  await fetch(`${BACKEND_HOST}/feed/share`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      ...video,
    }),
  })
}

export async function viewVideo(video: VideoRef, viewCount: number) {
  await fetch(`${BACKEND_HOST}/feed/view`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      ...video,
      viewCount,
    }),
  })
}
