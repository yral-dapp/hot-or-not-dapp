import type { SystemTime } from '$canisters/individual_user_template/individual_user_template.did'
import { readable } from 'svelte/store'

const ONE_HOUR_MS = 36_00_000
const SECONDS_MS = 1000
const MINUTES_MS = SECONDS_MS * 60
const HOURS_MS = MINUTES_MS * 60
const DAYS_MS = HOURS_MS * 24

type TimeParts = {
  minutes: number
  seconds: number
  days: number
  hours: number
}

export function getTimeLeft(startTime: Date, endTime: Date) {
  let diff = endTime.getTime() - startTime.getTime()
  if (diff > 0) {
    return readable<TimeParts>(getTimeStringFromMs(diff), (set) => {
      const updateMs = () => {
        diff -= 1000
        if (diff > 0) {
          set(getTimeStringFromMs(diff))
        } else {
          clearInterval(interval)
        }
      }

      const interval = setInterval(() => {
        updateMs
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    })
  } else {
    return readable<TimeParts>({ minutes: 0, seconds: 0, days: 0, hours: 0 })
  }
}

export function getMsLeftForBetResult(
  betSlotNumber: number,
  createdAt: SystemTime,
) {
  const betEndTime = new Date(Number(createdAt.secs_since_epoch) * 1000)

  betEndTime.setHours(betEndTime.getHours() + betSlotNumber)

  const now = new Date()
  let diff = betEndTime.getTime() - now.getTime()

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
        } else {
          counter = 1
          diff = ONE_HOUR_MS
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

export function getTimeStringFromMs(timeMs: number) {
  const days = Math.floor(timeMs / DAYS_MS)
  const hours = Math.round((timeMs % DAYS_MS) / HOURS_MS)
  const minutes = Math.floor((timeMs % HOURS_MS) / MINUTES_MS)
  const seconds = Math.floor((timeMs % MINUTES_MS) / 1000)
  return {
    minutes,
    seconds,
    days,
    hours,
  }
}
