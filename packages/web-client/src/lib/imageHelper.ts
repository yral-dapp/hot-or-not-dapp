import { auth } from '$stores/auth';
import { get } from 'svelte/store';

const cfWorkerHost = import.meta.env.VITE_CLOUDFLARE_WORKERS_API_HOST;

async function generateUrl() {
	const authStore = get(auth);
	const res = await fetch(`${cfWorkerHost}/image/getImageUploadURL`, {
		method: 'POST',
		body: JSON.stringify({
			principalId: authStore.principal?.toText() || '',
			fileName: Date.now().toString()
		})
	});
	const body = await res.json();
	console.log('image url request', body);

	if (body.success) {
		return body.result as { uploadURL: string; id: string };
	} else {
		return undefined;
	}
}

export async function uploadProfilePicture(file: Blob | File) {
	const uploadRes = await generateUrl();
	if (!uploadRes || !uploadRes.uploadURL) {
		return {
			success: false,
			error: "Couldn't generate upload Url"
		};
	}
	const formData = new FormData();
	formData.append('file', file);
	const res = await fetch(uploadRes.uploadURL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${import.meta.env.VITE_CF_STREAM_API}`
		},
		body: formData
	});
	const body = await res.json();
	console.log('uploaded image', body);
}
