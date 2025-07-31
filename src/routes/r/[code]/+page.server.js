import { LinkTracker } from '$lib/utils/linkTracker.js';
// import { redirect } from '@sveltejs/kit';

export async function load({ params, request }) {
  const { code } = params;
  try {
    return {
        //result : JSON.parse(result_),
        code:code,
    }
  } catch (error) {
    console.error('Page load error:', error);
    // Return error data to show 404 page
    return {
      error: 'Link not found or expired'
    };
  }
}