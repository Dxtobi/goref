import { error, json, redirect } from '@sveltejs/kit';
import { LinkTracker } from '$lib/utils/linkTracker.js';

export async function POST({ params, request, locals }) {
  const { code } = params;
  try {
    const body = await request.json()
    // console.log(body)
    // Record the click and get redirect URL
    const result = await LinkTracker.recordClick(code, request, locals, body.deviceId);
    // Redirect to the original URL
    // throw redirect(302, result.redirectUrl);
    // return new Response(null, { status: 302, headers: { Location:result.redirectUrl  } })
    return json(result, { status: 201 });
    // return result  
  } catch (err) {
    console.error('Redirect error:', err);
    // If link not found, redirect to a 404 page or home
    throw error(404, 'Link not found or expired');
  }
}

