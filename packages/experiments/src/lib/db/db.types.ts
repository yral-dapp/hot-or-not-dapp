export type UpDownPost = {
  id: string
  oid: number
  status: string
  share_count: number
  hashtags: string[]
  description: string
  created_at: number
  likes_count: number
  dislikes_count: number
  video_uid: string
  score: number
  views_count: number
  ouname: string
  ouid: string
}

export type CollectionName = 'ud-videos' | 'profile' | 'transactions'

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
  experimentsBalance: number
  anonId?: string
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
    published_at: number
    winning_transaction_id?: string
  }
}

export type TransanctionRecord = {
  uid: string
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
  debit: boolean
  type: 'vote-placed' | 'vote-result'
  voteId?: string
  amount: number
  created_at: number
  anon: boolean
}

export type VideoRef = {
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
}
