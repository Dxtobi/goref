import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for leaderboard queries
userSchema.index({ totalPoints: -1 });


// Master Link Schema (Original short links created by users)
const masterLinkSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 4,
    maxlength: 20
  },
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['general', 'promotion', 'content', 'product', 'event', 'other'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalClicks: {
    type: Number,
    default: 0,
    min: 0
  },
  totalShares: {
    type: Number,
    default: 0,
    min: 0
  },
  pointsPerClick: {
    type: Number,
    default: 1,
    min: 0
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries


// Referral Link Schema (Trackable instances when users share master links)
const referralLinkSchema = new mongoose.Schema({
  referralCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  masterLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterLink',
    required: true
  },
  sharer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clickCount: {
    type: Number,
    default: 0,
    min: 0
  },
  pointsEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastClickAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});



// Click Tracking Schema (Individual click events)
const clickSchema = new mongoose.Schema({
  referralLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferralLink',
    required: true
  },
  masterLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterLink',
    required: true
  },
  sharer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  referrer: {
    type: String,
    default: null
  },
  pointsAwarded: {
    type: Number,
    required: true,
    min: 0
  },
  isUnique: {
    type: Boolean,
    default: true
  },
  clickedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});



// User Points History Schema (For tracking point changes)
const pointsHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  masterLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterLink',
    required: true
  },
  referralLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferralLink',
    required: true
  },
  click: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Click',
    required: true
  },
  pointsEarned: {
    type: Number,
    required: true,
    min: 0
  },
  previousTotal: {
    type: Number,
    required: true,
    min: 0
  },
  newTotal: {
    type: Number,
    required: true,
    min: 0
  },
  action: {
    type: String,
    enum: ['click', 'bonus', 'penalty', 'adjustment'],
    default: 'click'
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  earnedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});



// Leaderboard Cache Schema (For performance optimization)
const leaderboardCacheSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['general', 'masterLink'],
    required: true
  },
  masterLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterLink',
    default: null
  },
  rankings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    points: {
      type: Number,
      required: true,
      min: 0
    },
    rank: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});



// Master Link Leaderboard Schema (Aggregated points per master link)
const masterLinkLeaderboardSchema = new mongoose.Schema({
  masterLink: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MasterLink',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  totalClicks: {
    type: Number,
    default: 0,
    min: 0
  },
  rank: {
    type: Number,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


// Create models
const User = mongoose.model('User', userSchema);
const MasterLink = mongoose.model('MasterLink', masterLinkSchema);
const ReferralLink = mongoose.model('ReferralLink', referralLinkSchema);
const Click = mongoose.model('Click', clickSchema);
const PointsHistory = mongoose.model('PointsHistory', pointsHistorySchema);
const LeaderboardCache = mongoose.model('LeaderboardCache', leaderboardCacheSchema);
const MasterLinkLeaderboard = mongoose.model('MasterLinkLeaderboard', masterLinkLeaderboardSchema);

export {
  User,
  MasterLink,
  ReferralLink,
  Click,
  PointsHistory,
  LeaderboardCache,
  MasterLinkLeaderboard
};

// Schema relationship summary:
// 1. User creates MasterLink (1:many)
// 2. User shares MasterLink creating ReferralLink (many:many through ReferralLink)
// 3. ReferralLink receives Clicks (1:many)
// 4. Clicks generate PointsHistory entries (1:1)
// 5. MasterLinkLeaderboard aggregates points per user per master link
// 6. LeaderboardCache stores computed rankings for performance