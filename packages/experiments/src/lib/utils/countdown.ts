import { readable } from 'svelte/store'
import { getTimeStringFromMs } from './timeLeft'

const HOUR_IN_MS = 36_00_000

export function getMsLeftForResult(endTime: Date, loop: boolean = false) {
  const now = new Date()
  let diff = endTime.getTime() - now.getTime()

  if (diff > 0) {
    const dt = getTimeStringFromMs(diff)
    const initialValue =
      dt.minutes + ':' + (dt.seconds < 10 ? '0' : '') + dt.seconds

    return readable(initialValue, (set) => {
      let counter = 1
      const updateMs = () => {
        if (diff - counter * 1000 > 0) {
          const { minutes, seconds } = getTimeStringFromMs(
            diff - counter * 1000,
          )
          set(minutes + ':' + (seconds < 10 ? '0' : '') + seconds)
        } else if (loop) {
          counter = 1
          diff = HOUR_IN_MS
        } else {
          clearInterval(interval)
          set('...')
        }
      }

      const interval = setInterval(() => {
        updateMs()
        counter++
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    })
  } else {
    return readable('...')
  }
}

export function getVoteEndTime(postCreatedAt: Date, voteCreatedAt: Date) {
  const startTime = postCreatedAt.getTime()
  const diff = voteCreatedAt.getTime() - startTime
  const slotNumber = Math.ceil(diff / 36_00_000)
  const endTime = new Date(startTime + slotNumber * 36_00_000)
  return endTime
}
