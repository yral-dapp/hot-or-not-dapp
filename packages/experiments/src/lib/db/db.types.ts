export type UpDownPost = {
  id: string
  oid: number
  status: string
  share_count: number
  hashtags: string[]
  description: string
  created_at: number
  likes_count: number
  video_uid: string
  score: number
  views_count: number
  ouname: string
  ouid: string
}

export type CollectionName =
  | 'ud-videos'
  | 'profile'
  | 'votes'
  | 'views'
  | 'likes'
  | 'transactions'

export type VideoRef = {
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
}

export type LikeRecord = {
  uid: string
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
  liked: boolean
  created_at: number
}

export type ProfileRecord = {
  uid: string
  username?: string
  name?: string
  img?: string
  experimentsBalance: number
}

export type ShareRecord = {
  uid: string
  videoOid: number
  videoUoid: string
  videoUid: string
  shareCount: boolean
  created_at: number
}

export type VoteRecord = {
  uid: string
  videoId: string
  videoOid: number
  videoUoid: string
  videoUid: string
  transactionId: string
  voteDirection: 'up' | 'down'
  voteAmount: number
  created_at: number
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
}
