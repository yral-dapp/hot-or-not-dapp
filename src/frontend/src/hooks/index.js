/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const response = await resolve(event, {
		ssr: process.env.BUILD_ENV === 'ic' ? false : true
	});

	return response;
}
