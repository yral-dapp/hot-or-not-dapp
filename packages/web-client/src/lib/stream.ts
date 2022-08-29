import { auth } from '$stores/auth';
import { get } from 'svelte/store';

const cfWorkerHost = import.meta.env.VITE_CLOUDFLARE_WORKERS_API_URL;

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
		return body.result as { uploadUrl: string; uid: string };
	} else {
		return undefined;
	}
}

export async function uploadVideoToStream(file: Blob) {
	const uploadRes = await generateUrl();
	if (!uploadRes || !uploadRes.uploadUrl) {
		return {
			success: false,
			error: "Couldn't generate upload Url"
		};
	}
	try {
		const formData = new FormData();
		formData.append('file', file);
		const res = await fetch(uploadRes.uploadUrl, {
			method: 'POST',
			body: formData
		});

		if (res.status != 200) {
			return {
				success: false,
				error: 'Something went wrong while uploading file'
			};
		} else {
			return {
				success: true,
				uid: uploadRes.uid
			};
		}
	} catch (e) {
		console.log('error', e);
		return {
			success: false,
			error: 'Something went wrong while uploading file'
		};
	}
}

export async function checkVideoStatus(uid: string) {
	try {
		const req = await fetch(`${cfWorkerHost}/video/${uid}/getVideoProcessingStatus`, {
			method: 'GET'
		});
		const res = await req.json();
		console.log('status res', res);
		return {
			success: true,
			status: (res.readyToStream ? 'ready' : 'processing') as 'ready' | 'processing'
		};
	} catch (e) {
		return {
			success: false,
			error: 'Something went wrong while checking status'
		};
	}
}
