const handler = async (request) => {
	try {
		const cloudflareVideoUid = request.params.cloudflareVideoUid;

		if (!cloudflareVideoUid) {
			return new Response('Insufficient data', {
				status: 400,
				headers: { ...request.corsHeaders }
			});
		}

		const res = await (
			await fetch(
				// eslint-disable-next-line no-undef
				`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${cloudflareVideoUid}/downloads`,
				{
					method: 'POST',
					headers: {
						// eslint-disable-next-line no-undef
						Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
					}
				}
			)
		).json();

		if (res && res.result && res.result.default) {
			return new Response(
				JSON.stringify({
					error: false,
					mp4Url: res.result.default
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
						...request.corsHeaders
					}
				}
			);
		} else throw new Error('No default received');
	} catch (error) {
		console.error(error);
		return new Response('Forbidden', {
			status: 403,
			headers: { ...request.corsHeaders }
		});
	}
};

export default handler;
