const watermarks = {
	upperLeft_P15_O20: '81d801d5ae267107463c3675dd2c774f',
	upperLeft_P10_O10: 'ef2464f8046f87db494bfc34da7bc72f',
	lowerLeft_P10_O10: '4f7af67fcb07e9a3627ec4f91ce3f85e',
	lowerRight_P10_O10: 'dcb685a38ef945d2ef48e6307b5e0f0f'
};

const handler = async (request) => {
	try {
		const requestBody = await request.json();

		if (!requestBody.principalId || !requestBody.fileName) {
			return new Response('Bad Request', {
				status: 400,
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
						maxDurationSeconds: 60,
						watermark: {
							uid: watermarks.upperLeft_P15_O20
						},
						meta: {
							creator: requestBody.principalId,
							uploadType: 'challenge',
							fileName: requestBody.fileName
						}
					})
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
