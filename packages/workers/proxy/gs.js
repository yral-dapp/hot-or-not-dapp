const path = 'https://d1l6p2sc9645hc.cloudfront.net/gosquared.js'

const handler = async (request) => {
  try {
    // Generate a new request for proxy
    const requestProxy = new Request(path, request)

    // Fetch script using the request proxy
    const response = await fetch(requestProxy)

    // Make the response mutable
    const fileContents = await response.text()

    return new Response(fileContents, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('origin') || '',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { ...request.corsHeaders },
    })
  }
}

export default handler
