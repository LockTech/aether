# Aether

[Aether](https://github.com/LockTech/aether) is a boilerplate for the [RedwoodJS framework](https://redwoodjs.com). It provides an additional set of opinionations to the framework, aiming to further decrease the time-to-market for full-stack web applications. These include various integrations, patterns, and architectures:

- Authentication (via [dbAuth](https://redwoodjs.com/docs/auth/dbauth))
  - Account confirmation
  - Password reset
  - Inviting members
  - Multi-tenancy (i.e. Teams)
  - RBAC
- Emailing (via [`email-templates`](https://github.com/forwardemail/email-templates))
- Error and performance tracking (via [Sentry](https://sentry.io/welcome/#))
- Local services — Postgres, Redis, ... (via [Docker Compose](https://docs.docker.com/compose/))
- PR quality assurances (via [`project-ci-action`](https://github.com/redwoodjs/project-ci-action))
- Subscriptions and payment-processing (via [Stripe](https://stripe.com/))
- UI Design (via [Chakra UI](https://chakra-ui.com/))
