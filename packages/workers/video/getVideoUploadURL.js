const watermarks = {
  upperLeft_P05_O40_S08: '28c721e45583a215d7b2ec1ae16e2679',
  yral: 'c094ef579b950a6a5ae3e482268b81ca',
}

const handler = async (request) => {
  try {
    console.log('request received')
    const requestBody = await request.json()

    if (!requestBody.principalId || !requestBody.fileName) {
      console.error('no principalId or no fileName')
      return new Response('Bad Request', {
        status: 400,
        headers: { ...request.corsHeaders },
      })
    }

    console.error('requestbody', requestBody.principalId, requestBody.fileName)

    // eslint-disable-next-line no-undef
    console.error('Cloudflare account ID', CLOUDFLARE_ACCOUNT_ID)

    const cloudflareGenerateUploadURLResponse = await (
      await fetch(
        // eslint-disable-next-line no-undef
        `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream/direct_upload`,
        {
          method: 'POST',
          headers: {
            // eslint-disable-next-line no-undef
            Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          },
          body: JSON.stringify({
            maxDurationSeconds: 60,
            watermark: {
              uid: watermarks.yral,
            },
            meta: {
              creator: requestBody.principalId,
              uploadType: 'challenge',
              fileName: requestBody.fileName,
            },
          }),
        },
      )
    ).json()

    console.log('response', JSON.stringify(cloudflareGenerateUploadURLResponse))

    return new Response(JSON.stringify(cloudflareGenerateUploadURLResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...request.corsHeaders,
      },
    })
  } catch (error) {
    console.log('Some error')
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 403,
      headers: { ...request.corsHeaders },
    })
  }
}

export default handler
