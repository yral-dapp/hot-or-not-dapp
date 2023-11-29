export type CollectionName =
  | 'ud-videos'
  | 'profile'
  | 'transactions'
  | 'votes'
  | 'referrals'
  | 'views'
  | 'view-change-parameters'

export type UpDownSubCollections =
  | 'likes'
  | 'dislikes'
  | 'shares'
  | 'view-updates'

export type UpDownPost = {
  id: string
  oid: number
  status: string
  share_count: number
  hashtags: string[]
  description: string
  created_at: number
  likes_count: number
  vote_count: number
  dislikes_count: number
  video_uid: string
  score: number
  views_count: number
  ouname: string
  ouid: string
}

export type LikeRecord = {
  uid: string
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
  liked: boolean
  created_at: number
  anon: boolean
}

export type ViewRecord = {
  uid: string
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
  viewCount: number
  viewCountRounded: number
  created_at: number
  anon: boolean
}

export type DislikeRecord = {
  uid: string
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
  disliked: boolean
  created_at: number
  anon: boolean
}

export type ProfileRecord = {
  uid: string
  name?: string
  anon: boolean
  photoUrl?: string
  email?: string
  refId?: string
  experimentsBalance: number
  anonId?: string
  created_at: number
}

export type ReferralRecord = {
  referred_by_uid: string
  referred_uid: string
  amount: number
  transaction_id: string
  created_at: number
}

export type ShareRecord = {
  uid: string
  videoOid: number
  videoUoid: string
  videoUid: string
  shareCount: boolean
  created_at: number
  anon: boolean
}

export type VoteRecord = {
  uid: string
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
  transactionId: string
  currentScore: number
  voteDirection: 'up' | 'down'
  voteAmount: number
  created_at: number
  result_at: number
  anon: boolean
  status: 'pending' | 'final'
  result?: {
    status: 'won' | 'lost' | 'tie'
    won_amount?: number
    published_at: number
    winning_transaction_id?: string
  }
}

export type TransanctionRecord = {
  uid: string
  videoId?: string
  videoOid?: number
  videoUoid?: string
  videoUid?: string
  debit: boolean
  type: 'vote-placed' | 'vote-result' | 'referral'
  voteId?: string
  amount: number
  created_at: number
  anon: boolean
}

export type ViewUpdateRecord = {
  uid: string
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
  created_at: number
  anon: boolean
  secondsFromStart: number
  minutesFromStart: number
  like: number
  dislike: number
  share: number
  fullyWatched: number
  videoWatchedPercentage: number
  thresholdView: number
  minutePassedAge: number
  viewsPerMinute: number
  change: {
    like: number
    dislike: number
    share: number
    videoWatchedPercentage: number
    thresholdView: number
    fullyWatched: number
    minutePassedAge: number
    viewsPerMinute: number
    totalChange: number
    totalScore: number
  }
}

export type VideoRef = {
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
}

export type ViewChangeParameters = {
  liked: {
    yes: number
    no: number
  }
  unliked: {
    yes: number
    no: number
  }
  shared: {
    yes: number
    no: number
  }
  watched: {
    divisor: number
    multiplier: number
  }
  threshold: {
    minPercentage: number
    yes: number
    no: number
  }
  fullyWatched: {
    yes: number
    no: number
  }
  minutePassed: number
  viewsPerMinute: {
    divisor: number
    threshold: number
    yes: number
    no: number
  }
  created_at: number
  created_by: string
}
