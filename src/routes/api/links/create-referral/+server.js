import { json } from '@sveltejs/kit';
import { LinkTracker } from '$lib/utils/linkTracker.js';

export async function POST({ request }) {
  try {
    const { masterLinkId, sharerId } = await request.json();
    console.log('making hit 1')

    if (!masterLinkId || !sharerId) {
    console.log('making hit')

      return json({ error: 'Master link ID and sharer ID are required' }, { status: 400 });
    }

    const referralLink = await LinkTracker.createReferralLink(masterLinkId, sharerId);
    return json({
      success: true,
      referralLink: {
        id: referralLink._id,
        referralCode: referralLink.referralCode,
        shareUrl: `/r/${referralLink.referralCode}`
      }
    });
  } catch (error) {
    console.error('Error creating referral link:', error);
    return json({ error: 'Failed to create referral link' }, { status: 500 });
  }
}
