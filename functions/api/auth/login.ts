import { json } from '@cloudflare/workers-types';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { password } = await request.json();
    const adminPassword = env.ADMIN_PASSWORD || 'admin123';

    if (password === adminPassword) {
      const response = new Response(JSON.stringify({ success: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'auth=authenticated; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400',
        },
      });
      return response;
    } else {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
