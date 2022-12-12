const handler = async (request) => {
	try {
		// eslint-disable-next-line no-undef
		const val = await CONFIG.get('signupsEnabled');

		return new Response({ allowed: val === true });
	} catch (error) {
		console.error(error);
		return new Response(
			{ error },
			{
				status: 403,
				headers: { ...request.corsHeaders }
			}
		);
	}
};

export default handler;
