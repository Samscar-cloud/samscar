import * as Sentry from '@sentry/nextjs'

export const captureException = (error: unknown, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context })
}
