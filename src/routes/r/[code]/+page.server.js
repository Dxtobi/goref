import { LinkTracker } from '$lib/utils/linkTracker.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, request }) {
  const { code } = params;

  try {
    // This will record the click and return the redirect URL
    const result_ = JSON.stringify(await LinkTracker.recordClick(code, request));
    
    // Redirect to the original URL
    return {
        result : JSON.parse(result_),
    }
  } catch (error) {
    console.error('Page load error:', error);
    
    // Return error data to show 404 page
    return {
      error: 'Link not found or expired'
    };
  }
}