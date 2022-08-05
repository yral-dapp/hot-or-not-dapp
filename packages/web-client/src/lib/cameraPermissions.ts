import { browser } from '$app/env';

type CameraPermissionRequest = {
	stream?: MediaStream;
	error: 'none' | 'denied' | 'no-stream';
};

type DevicesListRequest = {
	devices?: MediaDeviceInfo[];
	error: 'none' | 'denied' | 'no-stream';
};

export async function getMediaStream(): Promise<CameraPermissionRequest> {
	if (browser && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
		try {
			let stream: MediaStream | undefined = undefined;
			stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: { facingMode: ['user', 'environment'] }
			});
			return { stream, error: 'none' };
		} catch (err) {
			return { error: 'denied' };
		}
	} else return { error: 'no-stream' };
}

export async function getDevicesList(): Promise<DevicesListRequest> {
	if (browser && 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			// const videoDevices = devices.filter((device) => device.kind === 'videoinput');
			return { devices, error: 'none' };
		} catch (err) {
			return { error: 'denied' };
		}
	} else {
		return { error: 'no-stream' };
	}
}

export async function applyConstraintsOnVideoStream(
	stream: MediaStream,
	constraints: MediaTrackConstraints
) {
	try {
		const track = stream.getVideoTracks()[0];
		await track.applyConstraints(constraints);
		return true;
	} catch (_) {
		return false;
	}
}
