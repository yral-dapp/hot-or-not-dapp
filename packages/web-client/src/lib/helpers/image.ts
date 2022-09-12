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
	try {
		const res = await fetch(uploadRes.uploadURL, {
			method: 'POST',
			body: formData
		});
		console.log('image uploaded successfully, res', res);
		console.log('res.json', await res.json());
	} catch (e) {
		console.log('error uploading image', e);
	}
}
