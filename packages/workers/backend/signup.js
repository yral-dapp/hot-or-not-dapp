const handler = async (request) => {
	try {
		const val = await request.json();

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
