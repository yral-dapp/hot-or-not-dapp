const path = 'https://www.google-analytics.com/analytics.js'

const handler = async (request) => {
  try {
    // Generate a new request for proxy
    const requestProxy = new Request(path, request)

    // Fetch script using the request proxy
    let response = await fetch(requestProxy)

    // Make the response mutable
    const fileContents = await response.text()

    // Prepare response
    response = new Response(response.body)
    response.headers.set(
      'Access-Control-Allow-Origin',
      request.headers.get('origin') || '',
    )
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    return new Response(fileContents, response)
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { ...request.corsHeaders },
    })
  }
}

export default handler
