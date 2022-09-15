# Sentry

[Sentry](https://sentry.io/welcome/) is used for error and performance tracking. It has been configured for both the API and web sides — where it's expected both sides belong to a single [project](https://docs.sentry.io/product/sentry-basics/integrate-frontend/create-new-project/).

## DSN

The `SENTRY_DSN` environment variable should be used to provide [a Sentry DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/) — used to inform Sentry of where to send events for error and performance tracking.
