import Log from '$lib/utils/Log';

const cfWorkerHost = import.meta.env.VITE_CLOUDFLARE_WORKERS_API_HOST;

export async function checkSignupStatus() {
	try {
		const res = await fetch(`${cfWorkerHost}/backend/signup`);
		const body = await res.json();
		Log({ body, from: '0 checkSignupStatus' }, 'info');
	} catch (e) {
		Log({ error: e, from: '1 checkSignupStatus' }, 'error');
		return;
	}
}
