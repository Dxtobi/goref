import { redirect } from '@sveltejs/kit';
import { GoogleOAuthService } from '$lib/server/google-oauth.js';
import { AuthService } from '$lib/server/auth.js';

export async function GET({ url, cookies }) {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    console.log(error, '10')
    throw redirect(302, '/login?error=access_denied');
  }

  if (!code) {
    console.log('no code')
    throw redirect(302, '/login?error=no_code');
  }

  try {
    // Exchange code for access token
    const tokenData = await GoogleOAuthService.exchangeCodeForToken(code);
    
    // Get user info from Google
    const googleUser = await GoogleOAuthService.getUserInfo(tokenData.access_token);
    
    // Create or update user in database
    const user = await AuthService.createOrUpdateUser(googleUser);
    
    // Generate JWT token
    const token = AuthService.generateToken(user);
    
    // Set secure cookie
    cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });
    
    // throw redirect(302, '/dashboard');
    return new Response(null, { status: 302, headers: { Location:'/dashboard'  } })
  } catch (error) {
    console.error('OAuth callback error:', error);
    throw redirect(302, '/login?error=oauth_failed');
  }
}
