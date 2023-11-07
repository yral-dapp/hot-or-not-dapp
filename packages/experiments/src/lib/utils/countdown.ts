import { readable } from 'svelte/store'
import { getTimeStringFromMs } from './timeLeft'

export function getMsLeftForBetResult(betEndTime: Date) {
  const now = new Date()
  let diff = betEndTime.getTime() - now.getTime()

  if (diff > 0) {
    const dt = getTimeStringFromMs(diff)
    const initialValue =
      dt.minutes + ':' + (dt.seconds < 10 ? '0' : '') + dt.seconds

    return readable('', (set) => {
      let counter = 1
      const updateMs = () => {
        if (diff - counter * 1000 > 0) {
          const { minutes, seconds } = getTimeStringFromMs(
            diff - counter * 1000,
          )
          set(minutes + ':' + (seconds < 10 ? '0' : '') + seconds)
        } else {
          counter = 1
          diff = 36_00_000
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
    return readable('')
  }
}
