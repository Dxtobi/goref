import { error, redirect } from '@sveltejs/kit';
import { LinkTracker } from '$lib/utils/linkTracker.js';

export async function GET({ params, request }) {
  const { code } = params;

  try {
    // Record the click and get redirect URL
    const result = await LinkTracker.recordClick(code, request);
    
    // Redirect to the original URL
    throw redirect(302, result.redirectUrl);
  } catch (err) {
    console.error('Redirect error:', err);
    
    // If link not found, redirect to a 404 page or home
    throw error(404, 'Link not found or expired');
  }
}