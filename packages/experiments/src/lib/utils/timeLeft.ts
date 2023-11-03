import { readable } from 'svelte/store'

// const ONE_HOUR_MS = 36_00_000
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

      const interval = setInterval(updateMs, 1000)

      return () => {
        clearInterval(interval)
      }
    })
  } else {
    return readable<TimeParts>({ minutes: 0, seconds: 0, days: 0, hours: 0 })
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
