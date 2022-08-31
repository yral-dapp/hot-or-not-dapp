/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		ssr: import.meta.env.ENABLE_SSR
	});

	return response;
}
