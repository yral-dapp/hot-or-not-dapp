const handler = async (request) => {
	try {
		const requestBody = await request.json();

		if (!requestBody.principalId) {
			return new Response('Unauthorized', {
				status: 401,
				headers: { ...request.corsHeaders }
			});
		}

		const cloudflareGenerateUploadURLResponse = await (
			await fetch(
				// eslint-disable-next-line no-undef
				`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload`,
				{
					method: 'POST',
					headers: {
						// eslint-disable-next-line no-undef
						Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
					},
					body: JSON.stringify({
						maxDurationSeconds: 120,
						meta: {
							creator: requestBody.principalId,
							uploadType: 'challenge',
							fileName: requestBody.fileName
						}
					})
				}
			)
		).json();

		return new Response(
			JSON.stringify({ cloudflareGenerateUploadURLResponse, accountId: CLOUDFLARE_ACCOUNT_ID }),
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
		return new Response(JSON.stringify({ error }), {
			status: 403,
			headers: { ...request.corsHeaders }
		});
	}
};

export default handler;
