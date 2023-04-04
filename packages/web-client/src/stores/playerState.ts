import type { PostPopulated } from '$lib/helpers/feed'
import { writable } from 'svelte/store'

export const playerState = writable<{
  initialized: boolean
  visible: boolean
  muted: boolean
  currentFeedUrl: string
  currentHotOrNotUrl: string
  selectedCoins: 10 | 50 | 100
}>({
  initialized: false,
  muted: true,
  visible: true,
  currentFeedUrl: '',
  currentHotOrNotUrl: '',
  selectedCoins: 10,
})

export const homeFeedVideos = writable<PostPopulated[]>([])

export const hotOrNotFeedVideos = writable<PostPopulated[]>([])
