const handler = async (request) => {
	try {
		// eslint-disable-next-line no-undef
		const val = await configuration.get('signupsEnabled');

		return new Response({ allowed: val === true });
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error }), {
			status: 403,
			headers: { ...request.corsHeaders }
		});
	}
};

export default handler;
