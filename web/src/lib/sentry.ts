import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

process.env.NODE_ENV !== 'test' &&
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [new BrowserTracing()],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.25 : 0.0,
  })

export default Sentry
