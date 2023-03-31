import type { SystemTime } from '$canisters/individual_user_template/individual_user_template.did'
import { readable } from 'svelte/store'

export function getMsLeftForBetResult(
  betSlotNumber: number,
  createdAt: SystemTime,
) {
  const betEndTime = new Date(Number(createdAt.secs_since_epoch) * 1000)

  betEndTime.setHours(betEndTime.getHours() + betSlotNumber)

  const now = new Date()
  const diff = betEndTime.getTime() - now.getTime()

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
