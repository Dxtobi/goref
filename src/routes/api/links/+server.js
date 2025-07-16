import { json } from '@sveltejs/kit';
import { MasterLink } from '$lib/server/db/models/index.js';
import { AuthService } from '$lib/server/auth.js';

export async function POST({ request, cookies }) {
  try {
    const token = cookies.get('auth_token');
    const user = await AuthService.getUserFromToken(token);
    
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.originalUrl) {
      return json({ 
        errors: { 
          general: 'Title and URL are required' 
        } 
      }, { status: 400 });
    }
    
    // Validate URL format
    try {
      new URL(data.originalUrl);
    } catch {
      return json({ 
        errors: { 
          originalUrl: 'Please enter a valid URL' 
        } 
      }, { status: 400 });
    }
    
    // Generate unique short code
    const shortCode = generateShortCode();
    
    // Check if short code already exists
    const existingLink = await MasterLink.findOne({ shortCode });
    if (existingLink) {
      return json({ 
        errors: { 
          general: 'Short code already exists. Please try again.' 
        } 
      }, { status: 400 });
    }
    
    // Create new master link
    const masterLink = new MasterLink({
      shortCode,
      originalUrl: data.originalUrl,
      title: data.title,
      description: data.description || '',
      creator: user._id,
      category: data.category || 'general',
      pointsPerClick: Math.max(1, Math.min(100, data.pointsPerClick || 1)),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
    });
    
    await masterLink.save();
    
    return json({
      _id: masterLink._id,
      shortCode: masterLink.shortCode,
      originalUrl: masterLink.originalUrl,
      title: masterLink.title,
      description: masterLink.description,
      category: masterLink.category,
      pointsPerClick: masterLink.pointsPerClick,
      totalClicks: masterLink.totalClicks,
      totalShares: masterLink.totalShares,
      createdAt: masterLink.createdAt,
      expiresAt: masterLink.expiresAt
    });
    
  } catch (error) {
    console.error('Create link error:', error);
    return json({ 
      errors: { 
        general: 'Internal server error' 
      } 
    }, { status: 500 });
  }
}

function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}