const debugMode = true

export const registerPageView = (url: URL = new URL(window.location.href)) => {
  if (url?.href) {
    window.gtag?.('event', 'page_view', {
      page_location: url.href,
    })
  }
}

export const updateConfig = (tagId: string, params?: Gtag.CustomParams) => {
  if (window.gtag) {
    window.gtag('config', tagId, {
      ...params,
      ...(debugMode && { debug_mode: true }),
    })
    return true
  }
}

export const setUserProperties = (params?: Gtag.CustomParams) => {
  window.gtag?.('set', 'user_properties', {
    ...params,
  })
}

export const registerEvent = (
  eventName: Gtag.EventNames | string,
  eventParams?: Gtag.ControlParams | Gtag.EventParams | Gtag.CustomParams,
) => {
  window.gtag?.('event', eventName, {
    ...eventParams,
    ...(debugMode && { debug_mode: true }),
  })
}
