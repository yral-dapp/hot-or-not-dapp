import { writable } from 'svelte/store'

export const playerState = writable<{
  initialized: boolean
  visible: boolean
  muted: boolean
  selectedCoins: number
  currentFeedUrl: string
}>({
  initialized: false,
  muted: true,
  visible: true,
  selectedCoins: 50,
  currentFeedUrl: '',
})
