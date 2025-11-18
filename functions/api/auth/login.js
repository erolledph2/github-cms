export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const password = body?.password || '';
    const adminPassword = env.ADMIN_PASSWORD || 'admin123';

    if (password === adminPassword) {
      const headers = {
        'Content-Type': 'application/json',
        // Set cookie for auth — path=/ to allow site-wide detection.
        'Set-Cookie': 'auth=authenticated; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400',
      };

      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ error: 'Invalid password' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}