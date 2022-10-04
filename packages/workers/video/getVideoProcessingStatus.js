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

		let mp4Url = '';

		if (cloudflareQueryResponse.result.status.state === 'ready') {
			console.log('ready state');
			const res = await enableMp4Download(cloudflareVideoUid);
			console.log('ready state res', res);
			if (!res.error) {
				mp4Url = res.url;
			}
		}

		return new Response(
			JSON.stringify({
				readyToStream: cloudflareQueryResponse.result.status.state === 'ready',
				thumbnail: cloudflareQueryResponse.result.thumbnail,
				playback: cloudflareQueryResponse.result.playback,
				mp4Url
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

async function enableMp4Download() {
	try {
		const req = await fetch(
			// eslint-disable-next-line no-undef
			`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/${videoUid}/downloads`,
			{
				method: 'POST',
				headers: {
					// eslint-disable-next-line no-undef
					Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`
				}
			}
		);
		const res = await req.json();
		console.log('enableMp4Download res', res);
		if (res && res.result && res.result.default) {
			return res.result.default;
		} else throw new Error('No default received');
	} catch (e) {
		console.error('mp4 error', e);
		return { error: true };
	}
}

export default handler;
