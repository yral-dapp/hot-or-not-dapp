const TWO_DAYS_MS = 86_400 * 2 * 1000
import { formatDistanceToNow, format } from 'date-fns'

export default function (ms: number, options?: { showTime?: boolean }): string {
  const now = new Date().getTime()
  if (now - ms > TWO_DAYS_MS) {
    return format(
      new Date(ms),
      `${options?.showTime ? 'KK:mm aa, ' : ''}MM/dd/yy`,
    )
  }
  return formatDistanceToNow(ms, { addSuffix: true })
}
