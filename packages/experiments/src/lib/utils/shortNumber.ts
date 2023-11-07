export function getShortNumber(number: number) {
  if (number > 1000) {
    return `${Math.round((number / 1000) * 10) / 10}K`
  } else return number
}
