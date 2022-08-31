const handler = async (request) => {
	try {
		const cloudflareVideoUid = request.params.cloudflareVideoUid;

		const cloudflareQueryResponse = await (
			await fetch(
				// eslint-disable-next-line no-undef
				`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${cloudflareVideoUid}`,
				{
					method: 'GET',
					headers: {
						// eslint-disable-next-line no-undef
						Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
						'Content-Type': 'application/json'
					}
				}
			)
		).json();

		return new Response(
			JSON.stringify({
				readyToStream: cloudflareQueryResponse.result.status.state === 'ready',
				thumbnail: cloudflareQueryResponse.result.thumbnail,
				playback: cloudflareQueryResponse.result.playback
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					...request.corsHeaders
				}
			}
		);
	} catch (error) {
		console.error(error);
		return new Response('Forbidden', {
			status: 403,
			headers: { ...request.corsHeaders }
		});
	}
};

export default handler;
