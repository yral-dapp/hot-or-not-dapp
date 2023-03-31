import type { PlacedBetDetail } from '$canisters/individual_user_template/individual_user_template.did'
import { readable } from 'svelte/store'

export function getMsLeftForBetResult(placedBet: PlacedBetDetail) {
  const slotTime = new Date(
    Number(placedBet.bet_placed_at.secs_since_epoch) * 1000,
  )
  slotTime.setHours(slotTime.getHours() + placedBet.slot_id)
  const now = new Date()
  const diff = slotTime.getTime() - now.getTime()
  if (diff > 0) {
    return readable(getTimeStringFromMs(diff), (set) => {
      let counter = 1
      const updateMs = () => set(getTimeStringFromMs(diff - counter * 1000))

      const interval = setInterval(() => {
        updateMs()
        counter++
      }, 1000)

      return () => clearInterval(interval)
    })
  } else return readable(0)
}

export function getTimeStringFromMs(timeMs: number) {
  const minutes = Math.floor(timeMs / 60000)
  const seconds = Math.floor((timeMs % 60000) / 1000)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
