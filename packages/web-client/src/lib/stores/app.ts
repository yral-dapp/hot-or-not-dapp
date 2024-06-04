import type { PostPopulated } from '$lib/helpers/feed'
import { writable } from 'svelte/store'
import { persisted } from 'svelte-local-storage-store'

export const playerState = writable<{
  initialized: boolean
  visible: boolean
  muted: boolean
  currentFeedUrl: string
  currentHotOrNotUrl: string
  selectedCoins: number
  playFormat: 'hls' | 'mp4'
}>({
  initialized: false,
  muted: true,
  visible: true,
  currentFeedUrl: '',
  currentHotOrNotUrl: '',
  selectedCoins: 10,
  playFormat: 'hls',
})

export const homeFeedVideos = writable<PostPopulated[]>([])
export const hotOrNotFeedVideos = writable<PostPopulated[]>([])

export type UserProfile = {
  username_set: boolean
  unique_user_name: string
  profile_picture_url: string
  display_name: string
  principal_id?: string
  followers_count: number
  following_count: number
  profile_stats: {
    lifetime_earnings: number
    hots_earned_count: number
    nots_earned_count: number
  }
  is_migrated: boolean
  updated_at: number
}

export const emptyProfileValues = {
  username_set: false,
  unique_user_name: '',
  profile_picture_url: '',
  display_name: '',
  followers_count: 0,
  following_count: 0,
  profile_stats: {
    lifetime_earnings: 0,
    hots_earned_count: 0,
    nots_earned_count: 0,
  },
  is_migrated: false,
  updated_at: Date.now(),
}

export const userProfile = persisted<UserProfile>(
  'user-profile',
  emptyProfileValues,
)

export const appPrefs = persisted<{
  showNsfwVideos: boolean
}>('app-prefs', {
  showNsfwVideos: false,
})
