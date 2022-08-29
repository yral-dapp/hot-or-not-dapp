const handler = async (request) => {
	try {
		// const requestBody = await request.json();

		// if (!requestBody.principalId || !requestBody.fileName) {
		// 	return new Response('Bad Request', {
		// 		status: 400,
		// 		headers: { ...request.corsHeaders }
		// 	});
		// }

		// const cloudflareGenerateUploadURLResponse = await (
		// 	await fetch(
		// 		// eslint-disable-next-line no-undef
		// 		`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload`,
		// 		{
		// 			method: 'POST',
		// 			headers: {
		// 				// eslint-disable-next-line no-undef
		// 				Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
		// 			},
		// 			body: JSON.stringify({
		// 				maxDurationSeconds: 120,
		// 				meta: {
		// 					creator: requestBody.principalId,
		// 					uploadType: 'challenge',
		// 					fileName: requestBody.fileName
		// 				}
		// 			})
		// 		}
		// 	)
		// ).json();

		return new Response(
			JSON.stringify({
				token: CLOUDFLARE_API_TOKEN.substr(0, CLOUDFLARE_API_TOKEN.length - 4),
				accountId: CLOUDFLARE_ACCOUNT_ID
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
		return new Response(JSON.stringify({ error }), {
			status: 403,
			headers: { ...request.corsHeaders }
		});
	}
};

export default handler;
