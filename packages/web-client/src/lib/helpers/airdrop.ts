export async function registerNNSId(data: {
  principalId: string
  canisterId: string
  nnsId: string
}): Promise<boolean> {
  try {
    const res = await fetch('https://registernnsid-5nps3y6y6a-uc.a.run.app', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data }),
    })

    const body = await res.json()

    if (body.success) return true
    return false
  } catch (e) {
    console.error('Error adding document: ', e)
    return false
  }
}

export async function airdropEntryDetails(principalId: string) {
  try {
    const res = await fetch(
      `https://getairdropentrydetails-5nps3y6y6a-uc.a.run.app?principalId=${principalId}`,
      {
        mode: 'cors',
      },
    )

    const body = await res.json()

    if (body.success && body.exists) {
      return body.doc as {
        FinalCOYNWalletBalance: string
        FinalHotTokens: number
      }
    }
    return false
  } catch (e) {
    console.error('Error adding document: ', e)
    return false
  }
}

export async function isNNSIdRegistered(principalId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://isregisteredfornns-5nps3y6y6a-uc.a.run.app?principalId=${principalId}`,
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
