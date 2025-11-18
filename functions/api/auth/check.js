export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const isAuthed = cookieHeader.includes('auth=authenticated');

    if (isAuthed) {
      return new Response(JSON.stringify({ authenticated: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}