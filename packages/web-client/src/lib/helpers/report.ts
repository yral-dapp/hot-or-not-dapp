import type {
  PostReportData,
  ProfileReportData,
} from '@hnn/components/popup/ReportPopup.types'
import { saveReportedPostInDb } from './feed'

export async function reportPostOrUser(data: {
  type: 'post' | 'profile'
  data: ProfileReportData | PostReportData
  selectedReason: string
}) {
  let text = ''
  if (data.type === 'post' && 'postId' in data.data) {
    text = `🎞️ Video reported 🚨  
    Video Link: https://hotornot.wtf/profile/${data.data.postUploadedByUserId}/post/${data.data.postId}
    Profile Link: https://hotornot.wtf/profile/${data.data.postUploadedByUserId}
    Reported Video ID: ${data.data.postCanisterId}@${data.data.postId} 
    Reported Video Cloudflare UID: ${data.data.videoUid} 
    Reported by: ${data.data.reportedByUserId} 
    Reason: ${data.selectedReason}`

    // Save post to DB
    saveReportedPostInDb(
      `${data.data.postCanisterId}@${data.data.postId}`,
      data.selectedReason,
    )
  } else if ('userId' in data.data) {
    text = `👮 Profile reported 🚨
    Profile Link: https://hotornot.wtf/profile/${data.data.userId}
    Reported by: ${data.data.reportedByUserId} 
    Reason: ${data.selectedReason}`
  }
  await fetch(
    'https://chat.googleapis.com/v1/spaces/AAAAHzDmNaM/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=nUnkgIqr0tLjDV5lWRge9tqEN5Nq9YX14wU9e9HUCiU%3D',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    },
  )
}
