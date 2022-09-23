const host = 'https://customer-2p3jflss4r4hmpnz.cloudflarestream.com';

export function getThumbnailUrl(uid: string) {
	return `${host}/${uid}/thumbnails/thumbnail.jpg`;
}

export function getMp4Url(uid: string) {
	return `${host}/${uid}/downloads/default.mp4`;
}
