async function generateUrl() {
	const res = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${
			import.meta.env.VITE_CF_ACCOUNT_ID
		}/stream/direct_upload`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_CF_STREAM_API}`
			},
			body: JSON.stringify({
				maxDurationSeconds: 3600,
				expiry: '2020-04-06T02:20:00Z',
				requireSignedURLs: true,
				allowedOrigins: ['hotornot.wtf', 'localhost:5173'],
				thumbnailTimestampPct: 0.568427
				// TODO: Add watermark
				// watermark: {
				// 	uid: '<WATERMARK_UID>'
				// }
			})
		}
	);
	const body = await res.json();
	if (body.success) {
		return body.result.uploadUrl as string;
	} else {
		return undefined;
	}
}

export async function uploadVideoToStream(file: Blob) {
	const uploadUrl = await generateUrl();
	if (!uploadUrl) {
		return {
			success: false,
			error: "Couldn't generate upload Url"
		};
	}
	try {
		const formData = new FormData();
		formData.append('file', file);
		const res = await fetch(uploadUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${import.meta.env.VITE_CF_STREAM_API}`
			},
			body: formData
		});
		const body = await res.json();
		if (!body || (body && !body.success)) {
			return {
				success: false,
				error: 'Something went wrong while uploading file'
			};
		} else {
			return {
				success: true,
				uploadedUrl: body.result.preview
			};
		}
	} catch (e) {
		console.log('error', e);
		return {
			success: false,
			error: 'Something went wrong while uploading file'
		};
	}
}
