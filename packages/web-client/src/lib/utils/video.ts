//@ts-nocheck

export function videoHasAudio(videoEl: HTMLVideoElement) {
	return (
		videoEl?.mozHasAudio ||
		Boolean(videoEl?.webkitAudioDecodedByteCount) ||
		Boolean(videoEl?.audioTracks && videoEl?.audioTracks?.length)
	);
}
