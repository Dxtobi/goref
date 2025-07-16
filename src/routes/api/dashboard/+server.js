import { json } from '@sveltejs/kit';
import { MasterLink, ReferralLink } from '$lib/server/db/models/index.js';
import { AuthService } from '$lib/server/auth.js';

export async function GET({ cookies }) {
  try {
    const token = cookies.get('auth_token');
    const user = await AuthService.getUserFromToken(token);
    
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user's created links
    const links = await MasterLink.find({ creator: user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get user's referral stats
    const referralCount = await ReferralLink.countDocuments({ sharer: user._id });
    
    return json({
      links: links.map(link => ({
        _id: link._id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        title: link.title,
        description: link.description,
        category: link.category,
        pointsPerClick: link.pointsPerClick,
        totalClicks: link.totalClicks,
        totalShares: link.totalShares,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt
      })),
      stats: {
        totalLinks: links.length,
        totalReferrals: referralCount
      }
    });
    
  } catch (error) {
    console.error('Dashboard API error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}