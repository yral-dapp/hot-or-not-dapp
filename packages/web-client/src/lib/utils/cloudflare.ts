const host = 'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com'

export function getThumbnailUrl(uid: string, height = 320) {
  return `${host}/${uid}/thumbnails/thumbnail.jpg?height=${height}`
}

export function getMp4Url(uid: string) {
  return `${host}/${uid}/downloads/default.mp4`
}

export function getHlsUrl(uid: string) {
  return `${host}/${uid}/manifest/video.m3u8`
}

export function getDashUrl(uid: string) {
  return `${host}/${uid}/manifest/video.mpd`
}
