import { auth } from '$stores/auth';
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

export async function uploadVideoToStream(file: Blob | File, onProgress: any) {
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

export async function checkVideoStatus(uid: string) {
	try {
		const req = await fetch(`${cfWorkerHost}/video/${uid}/getVideoProcessingStatus`, {
			method: 'GET'
		});
		const res = await req.json();
		return {
			success: true,
			result: res
		};
	} catch (e) {
		return {
			success: false,
			error: 'Something went wrong while checking status'
		};
	}
}
