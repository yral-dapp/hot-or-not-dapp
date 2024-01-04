import { registerEvent } from '@hnn/components/analytics/GA.utils'
import {
  shareVideo,
  toggleDislike,
  toggleLike,
  viewVideo,
} from '$lib/db/actions'
import type { UpDownPost } from '$lib/db/db.types'
import { updatePostInWatchHistory } from '$lib/idb/history'
import { authState } from '$stores/auth'
import { get } from 'svelte/store'

export type WatchProgress = {
  totalCount: number
  partialWatchedPercentage: number
}

export async function sharePost(post: UpDownPost) {
  try {
    await navigator.share({
      title: 'Hot or Not',
      text: `Check out this video at UpDown! \n${post.description}`,
      url: `https://experiments.hotornot.wtf/up-down/${post.ouid}@${post.oid}`,
    })
  } catch (e) {
    console.warn("Can't share", e)
  } finally {
    await shareVideo({
      videoId: post.id,
      videoOid: post.oid,
      videoUoid: post.ouid,
      videoUid: post.video_uid,
    })

    const authStateData = get(authState)

    registerEvent('share_video', {
      userId: authStateData.userId,
      video_id: post.id,
      share_count: post.share_count,
      anon: !!authStateData.isLoggedIn,
    })
  }
}

export async function likePost(post: UpDownPost) {
  await toggleLike({
    videoId: post.id,
    videoOid: post.oid,
    videoUoid: post.ouid,
    videoUid: post.video_uid,
  })

  // updatePostInWatchHistory('up-down-watch-history', post, {
  //   liked_by_me: !post.liked_by_me,
  //   like_count: post.like_count + BigInt(post.liked_by_me ? -1 : 1),
  // })

  const authStateData = get(authState)

  registerEvent('like_video', {
    userId: authStateData.userId,
    video_id: post.id,
    likes: post.likes_count,
    anon: !!authStateData.isLoggedIn,
  })
}

export async function dislikePost(post: UpDownPost) {
  await toggleDislike({
    videoId: post.id,
    videoOid: post.oid,
    videoUoid: post.ouid,
    videoUid: post.video_uid,
  })

  // updatePostInWatchHistory('up-down-watch-history', post, {
  //   liked_by_me: !post.liked_by_me,
  //   like_count: post.like_count + BigInt(post.liked_by_me ? -1 : 1),
  // })

  const authStateData = get(authState)

  registerEvent('dislike_video', {
    userId: authStateData.userId,
    video_id: post.id,
    likes: post.likes_count,
    anon: !!authStateData.isLoggedIn,
  })
}

export async function viewPost(
  post: UpDownPost,
  watchProgress?: WatchProgress,
) {
  if (!watchProgress) return
  const { totalCount, partialWatchedPercentage } = watchProgress
  if (totalCount === 0 && partialWatchedPercentage === 0) return

  const viewCount = (totalCount || 0) + (partialWatchedPercentage || 0) / 100

  if (!viewCount) return

  updatePostInWatchHistory('up-down-watch-history', post)

  await viewVideo(
    {
      videoId: post.id,
      videoOid: post.oid,
      videoUoid: post.ouid,
      videoUid: post.video_uid,
    },
    viewCount,
  )

  const authStateData = get(authState)

  registerEvent('view_video', {
    userId: authStateData.userId,
    video_id: post.id,
    view_count: post.views_count,
    anon: !!authStateData.isLoggedIn,
  })
}
