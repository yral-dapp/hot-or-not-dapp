import type { VideoRef } from './db.types'
import { getHeaders } from './db.utils'
import { BACKEND_HOST } from './index'

export async function toggleLike(video: VideoRef) {
  await fetch(`${BACKEND_HOST}/feed/like`, {
    method: 'POST',
    headers: getHeaders('POST'),
    body: JSON.stringify({
      ...video,
    }),
  })
}

export async function toggleDislike(video: VideoRef) {
  await fetch(`${BACKEND_HOST}/feed/dislike`, {
    method: 'POST',
    headers: getHeaders('POST'),
    body: JSON.stringify({
      ...video,
    }),
  })
}

export async function shareVideo(video: VideoRef) {
  await fetch(`${BACKEND_HOST}/feed/share`, {
    method: 'POST',
    headers: getHeaders('POST'),
    body: JSON.stringify({
      ...video,
    }),
  })
}

export async function viewVideo(video: VideoRef, viewCount: number) {
  await fetch(`${BACKEND_HOST}/feed/view`, {
    method: 'POST',
    headers: getHeaders('POST'),
    body: JSON.stringify({
      ...video,
      viewCount,
    }),
  })
}

export async function placeVote(
  video: VideoRef,
  voteAmount: number,
  voteDirection: 'up' | 'down',
) {
  const res = await fetch(`${BACKEND_HOST}/vote`, {
    method: 'POST',
    headers: getHeaders('POST'),
    body: JSON.stringify({
      ...video,
      voteAmount,
      voteDirection,
    }),
  })

  return await res.json()
}
