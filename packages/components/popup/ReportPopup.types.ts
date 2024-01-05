export type ReportType = 'profile' | 'post'

export type PostReportData = {
  postCanisterId: string
  postUploadedByUserId: string
  postId: string
  reportedByUserId: string
  videoUid: string
}

export type ProfileReportData = {
  userId: string
  reportedByUserId: string
}
