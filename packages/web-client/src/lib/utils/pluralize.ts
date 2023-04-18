export function pluralize(word: string, count: number, suffix = 's') {
  if (count > 1) {
    return word + suffix
  } else return word
}
