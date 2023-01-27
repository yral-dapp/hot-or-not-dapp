const handler = async (request) => {
  try {
    // eslint-disable-next-line no-undef
    const val = await CONFIG.get('signupsEnabled')

    return new Response(JSON.stringify({ allowed: val === 'true' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...request.corsHeaders,
      },
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 403,
      headers: { ...request.corsHeaders },
    })
  }
}

export default handler
