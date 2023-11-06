import { getHeaders } from './db.utils'
import { BACKEND_HOST } from './index'

export async function toggleLike(videoId: string) {
  await fetch(`${BACKEND_HOST}/feed/like`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      videoId,
    }),
  })
}

export async function shareVideo(videoId: string) {
  await fetch(`${BACKEND_HOST}/feed/share`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      videoId,
    }),
  })
}

export async function viewVideo(videoId: string, viewCount: number) {
  await fetch(`${BACKEND_HOST}/feed/view`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      videoId,
      viewCount,
    }),
  })
}
