import auth from '$stores/auth';
import { get } from 'svelte/store';

const cfWorkerHost = import.meta.env.VITE_CLOUDFLARE_WORKERS_API_HOST;

async function generateUrl() {
	const authStore = get(auth);
	const res = await fetch(`${cfWorkerHost}/video/getVideoUploadURL`, {
		method: 'POST',
		body: JSON.stringify({
			principalId: authStore.principal?.toText() || '',
			fileName: Date.now().toString()
		})
	});
	const body = await res.json();
	if (body.success) {
		return body.result as { uploadURL: string; uid: string };
	} else {
		return undefined;
	}
}

export async function uploadVideoToStream(
	file: Blob | File,
	onProgress: any
): Promise<UploadVideoToStream> {
	const uploadRes = await generateUrl();
	if (!uploadRes || !uploadRes.uploadURL) {
		return {
			success: false,
			error: "Couldn't generate upload Url"
		};
	}

	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', (e) => onProgress(e.loaded / e.total));
		xhr.addEventListener('load', () => resolve({ success: true, uid: uploadRes.uid }));
		xhr.addEventListener('error', () => resolve({ success: false, error: 'Something went wrong' }));
		xhr.addEventListener('abort', () =>
			resolve({ success: false, error: 'Upload cancelled by user' })
		);
		xhr.open('POST', uploadRes.uploadURL, true);
		const formData = new FormData();
		formData.append('file', file);
		xhr.send(formData);
	});
}

export async function checkVideoStatus(uid: string): Promise<CheckVideoStatus> {
	try {
		const req = await fetch(`${cfWorkerHost}/video/${uid}/getVideoProcessingStatus`, {
			method: 'GET'
		});
		const result: CheckVideoStatusResult = await req.json();
		return {
			success: true,
			result
		};
	} catch (e) {
		return {
			success: false,
			error: 'Something went wrong while checking status'
		};
	}
}

type RequestError = {
	success: false;
	error: string;
};

export type CheckVideoStatusResult = {
	readyToStream: boolean;
	thumbnail: string;
	playback?: {
		hls?: string;
		dash?: string;
	};
};

type CheckVideoStatus =
	| RequestError
	| {
			success: true;
			result: CheckVideoStatusResult;
	  };

type UploadVideoToStream = RequestError | { success: true; uid: string };
