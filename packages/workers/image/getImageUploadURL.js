const handler = async (request) => {
	try {
		const requestBody = await request.json();

		if (!requestBody.principalId) {
			return new Response('Bad Request', {
				status: 400,
				headers: { ...request.corsHeaders }
			});
		}

		const form = new FormData();
		form.append('requireSignedURLs', 'false');
		form.append(
			'metadata',
			`{"creator":"${requestBody.principalId}", "uploadType": "profile-image"}`
		);

		const cloudflareGenerateUploadURLResponse = await (
			await fetch(
				// eslint-disable-next-line no-undef
				`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
				{
					method: 'POST',
					headers: {
						// eslint-disable-next-line no-undef
						Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
					},
					body: form
				}
			)
		).json();

		return new Response(JSON.stringify(cloudflareGenerateUploadURLResponse), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				...request.corsHeaders
			}
		});
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error }), {
			status: 403,
			headers: { ...request.corsHeaders }
		});
	}
};

export default handler;
