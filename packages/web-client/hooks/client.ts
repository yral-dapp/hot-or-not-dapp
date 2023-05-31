import '$lib/services/sentry.init'
import * as Sentry from '@sentry/sveltekit'
import Log from '$lib/utils/Log'

const logError = ({ error, event }: any) => {
  Log({ error, event }, 'error')
}

export const handleError = Sentry.handleErrorWithSentry(logError)
