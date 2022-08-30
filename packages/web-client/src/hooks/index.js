/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	console.log('ssr', import.meta.env.IS_SSR);
	const ssr = import.meta.env.IS_SSR === 'yes';
	const response = await resolve(event, {
		ssr
	});

	return response;
}
