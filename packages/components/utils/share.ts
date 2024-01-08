export async function shareBrowser(data: ShareData) {
  try {
    if (navigator.canShare(data)) {
      await navigator.share(data)
    } else {
      throw 'Can not share in this context'
    }
  } catch (e) {
    console.warn('Could not share', {
      from: 'shareBrowser',
      data,
      e,
    })
  }
}
