const watermarks = {
	upperLeft_P15_O20: '81d801d5ae267107463c3675dd2c774f',
	upperLeft_P10_O10: 'ef2464f8046f87db494bfc34da7bc72f',
	upperLeft_P05_O30: '5ee9ac6a166816ea7fd162f5d11e4786',
	upperRight_P05_O30: 'b676972b195fb3f1dc257f98b1bb58e5',
	lowerLeft_P05_O30: '5806ef9bd540bb8910a6de5fcaf7b52c',
	lowerRight_P05_O30: '5a271d125e6a41268daeea62c2fdabc5',
	upperLeft_P05_O30_S08: 'aff5d54b36e1ed1f8cf7566675cf0a2d'
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
							uid: watermarks.upperLeft_P05_O30_S08
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
