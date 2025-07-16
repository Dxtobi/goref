import { json } from '@sveltejs/kit';
import { ReferralLink, Click } from '$lib/models/schemas.js';

export async function GET({ params }) {
  const { code } = params;

  try {
    const referralLink = await ReferralLink.findOne({ referralCode: code })
      .populate('masterLink sharer');

    if (!referralLink) {
      return json({ error: 'Referral link not found' }, { status: 404 });
    }

    // Get click analytics
    const clicks = await Click.find({ referralLink: referralLink._id })
      .sort({ clickedAt: -1 })
      .limit(100);

    // Get click stats
    const totalClicks = referralLink.clickCount;
    const uniqueClicks = clicks.filter(click => click.isUnique).length;
    const pointsEarned = referralLink.pointsEarned;

    // Get geographic data
    const countries = {};
    const cities = {};
    clicks.forEach(click => {
      if (click.country) {
        countries[click.country] = (countries[click.country] || 0) + 1;
      }
      if (click.city) {
        cities[click.city] = (cities[click.city] || 0) + 1;
      }
    });

    // Get daily click data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyClicks = await Click.aggregate([
      {
        $match: {
          referralLink: referralLink._id,
          clickedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' }
          },
          count: { $sum: 1 },
          uniqueCount: {
            $sum: { $cond: [{ $eq: ['$isUnique', true] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return json({
      referralLink: {
        code: referralLink.referralCode,
        masterLink: referralLink.masterLink,
        sharer: referralLink.sharer
      },
      stats: {
        totalClicks,
        uniqueClicks,
        pointsEarned,
        conversionRate: totalClicks > 0 ? ((uniqueClicks / totalClicks) * 100).toFixed(2) : 0
      },
      geographic: {
        countries,
        cities
      },
      dailyClicks
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}