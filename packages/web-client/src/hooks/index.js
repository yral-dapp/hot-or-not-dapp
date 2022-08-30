/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	console.log('ssr', import.meta.env.IS_SSR);
	const response = await resolve(event, {
		ssr: import.meta.env.IS_SSR == 'yes'
	});

	return response;
}
