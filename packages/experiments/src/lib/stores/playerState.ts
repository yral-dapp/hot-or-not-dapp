import { writable } from 'svelte/store'

export const playerState = writable<{
  initialized: boolean
  visible: boolean
  muted: boolean
  selectedCoins: number
  currentFeedUrl: string
  playFormat: 'hls' | 'mp4'
}>({
  initialized: false,
  muted: true,
  visible: true,
  selectedCoins: 50,
  currentFeedUrl: '',
  playFormat: 'hls',
})
