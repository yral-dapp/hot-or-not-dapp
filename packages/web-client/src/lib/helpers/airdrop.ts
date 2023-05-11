export type AirdropFormData = {
  principalId: string
  walletBalance: number
  canisterId: string
  email: string
  tweetLink: string
  sns1Token: {
    checked: boolean
    principalId: string
  }
  chatToken: {
    checked: boolean
    principalId: string
  }
  fundedNft: {
    checked: boolean
    principalId: string
  }
  gobGobNft: {
    checked: boolean
    principalId: string
  }
}

const x = btoa

export async function uploadForm(data: AirdropFormData): Promise<boolean> {
  try {
    const res = await fetch('https://submitentry-5nps3y6y6a-uc.a.run.app', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, uid: x(data.canisterId + data.email) }),
    })

    const body = await res.json()

    console.log({ body })

    if (body.success) return true
    return false
  } catch (e) {
    console.error('Error adding document: ', e)
    return false
  }
}

export async function isFormFilled(principalId: string): Promise<boolean> {
  try {
    if (principalId === '2vxsx-fae') return false

    const res = await fetch(
      `https://entryexists-5nps3y6y6a-uc.a.run.app/?principalId=${principalId}`,
      {
        mode: 'cors',
      },
    )

    const body = await res.json()

    if (body.success && body.exists) return true
    return false
  } catch (e) {
    console.error('Error adding document: ', e)
    return false
  }
}
