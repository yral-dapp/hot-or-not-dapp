import Log from '$lib/utils/Log';

const cfWorkerHost = import.meta.env.VITE_CLOUDFLARE_WORKERS_API_HOST;

export async function checkSignupStatus(): Promise<boolean> {
	try {
		const res = await fetch(`${cfWorkerHost}/backend/signupStatus`);
		const body = await res.json();
		Log({ body, from: '0 checkSignupStatus' }, 'info');
		if (body.allowed) {
			return true;
		} else return false;
	} catch (e) {
		Log({ error: e, from: '1 checkSignupStatus' }, 'error');
		return false;
	}
}
