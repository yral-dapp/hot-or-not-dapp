const TWO_DAYS_MS = 86_400 * 2 * 1000
import { formatDistanceToNow } from 'date-fns'

export default function (ms: number): string {
  const now = new Date().getTime()
  if (now - ms > TWO_DAYS_MS) {
    return new Date(ms).toLocaleDateString()
  }
  return formatDistanceToNow(ms, { addSuffix: true })
}
