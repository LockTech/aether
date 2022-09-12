<div align="center">
  <h1>☁️&nbsp;&nbsp;&nbsp;Aether</h1>
  <p>(a) Boilerplate for the <a href="https://redwoodjs.com">RedwoodJS framework</a></p>
  <br />
</div>

Aether provides a set of opinionations to RedwoodJS applications — aiming to further decrease time-to-market for full-stack web applications. These (additional) opinionations include:

- Authentication (via [dbAuth](https://redwoodjs.com/docs/auth/dbauth))
  - Account confirmation
  - Password reset
  - Inviting members
  - Multi-tenancy (i.e. Teams)
  - RBAC
- [Chakra UI](https://chakra-ui.com/)
- [Emailing](https://github.com/forwardemail/email-templates)
- Local services (i.e. Postgres, Redis, ...) via [Docker Compose](https://docs.docker.com/compose/)
- Pull-request [quality assurance](https://github.com/redwoodjs/project-ci-action)
- Subscription-only access (via [Stripe](https://stripe.com/))
- Support for [Sentry](https://sentry.io/welcome/#) on the API and web sides

## Getting Started

### Prerequisites

- Ensure your system fulfills [the RedwoodJS prerequisites](https://redwoodjs.com/docs/quick-start).
- The [Stripe CLI](https://stripe.com/docs/stripe-cli)
- A Postgre database
  - If you plan to use [the provided `docker-compose.yml`](./docker-compose.yml) — ensure you have installed [Docker (Desktop)](https://www.docker.com/products/docker-desktop/)
  - See [the RedwoodJS documentation for a local Postgres setup](https://redwoodjs.com/docs/local-postgres-setup).

### 1) Clone the repository

```bash
git clone https://github.com/LockTech/aether.git
```

### 2) Reset git history

Delete the `.git` directory, removing the Aether repository's history.

```bash
rm -rf .git
```

Once deleted, you may re-initalize a new repository — ensuring a clean history and allowing you to re-license your project.

```bash
git init
```

### 3) Install dependencies

```bash
yarn install
```

### 4) Configure the application

See [the attached `.env.defaults`](./.env.defaults) for a list of [the environment variables](https://redwoodjs.com/docs/environment-variables) required by this boilerplate.

> During development, only the variables including the character-sequence `...` need sensitive values.

#### Sentry DSN

The `SENTRY_DSN` environment variable should be used to provide a [Sentry DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/) — used in order to send events to Sentry for error and performance tracking.

#### Stripe Webhooks

Two [Stripe webhooks](https://stripe.com/docs/webhooks) should be configured, pointing to the following endpoints and triggered by the corresponding [events](https://stripe.com/docs/webhooks/stripe-events):

- `/stripeSetupIntent`
  - `setup_intent.succeeded`
- `/stripeSubscription`
  - `customer.subscription.created`
  - `customer.subscription.deleted`
  - `customer.subscription.updated`

The `STRIPE_SETUP_INTENT_SECRET` and `STRIPE_SUBSCRIPTION_SECRET` environment variables can be used to configure the webhook's [signatures](https://stripe.com/docs/webhooks/signatures) — used to authenticate requests originated by Stripe's services.

> By default, these secrets will only be used in production and when testing the application. In other words, webhook validation is disabled during development.

### 5) Start local services

If not done already, start a local Postgres database.

> The command below is only applicable if you're using [the `docker-compose.yml` configuration](./docker-compose.yml).

```bash
docker compose up -d
```

Then, ensure your database is in-sync with your Prisma schema:

```
yarn rw prisma db push
```

### 6) Start developing!

Begin the development server by starting [RedwoodJS' development server](https://redwoodjs.com/docs/cli-commands#dev).

```bash
yarn rw dev
```

If you plan to make use of Stripe webhooks (i.e., when creating a new user and subscription) you'll need to [listen for events](https://stripe.com/docs/stripe-cli/about-events), forwarding them to the local development server. To facilitate this, [a script has been included](./scripts/stripe.ts) which can be invoked using:

```bash
yarn rw exec stripe
```

## License

This boilerplate, [like the RedwoodJS framework](https://github.com/redwoodjs/redwood/blob/main/LICENSE), is available under [the MIT license](./LICENSE) — feel free to use the boilerplate for any commercial, internal, or personal projects.

Your project can be provided under any license you (and your team) see fit.

----

## RedwoodJS README

Welcome to [RedwoodJS](https://redwoodjs.com)!

> **Prerequisites**
>
> - Redwood requires [Node.js](https://nodejs.org/en/) (>=14.19.x <=16.x) and [Yarn](https://yarnpkg.com/) (>=1.15)
> - Are you on Windows? For best results, follow our [Windows development setup](https://redwoodjs.com/docs/how-to/windows-development-setup) guide

Start by installing dependencies:

```
yarn install
```

Then change into that directory and start the development server:

```
cd my-redwood-project
yarn redwood dev
```

Your browser should automatically open to http://localhost:8910 where you'll see the Welcome Page, which links out to a ton of great resources.

> **The Redwood CLI**
>
> Congratulations on running your first Redwood CLI command!
> From dev to deploy, the CLI is with you the whole way.
> And there's quite a few commands at your disposal:
> ```
> yarn redwood --help
> ```
> For all the details, see the [CLI reference](https://redwoodjs.com/docs/cli-commands).

### Prisma and the database

Redwood wouldn't be a full-stack framework without a database. It all starts with the schema. Open the [`schema.prisma`](api/db/schema.prisma) file in `api/db` and replace the `UserExample` model with the following `Post` model:

```
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  body      String
  createdAt DateTime @default(now())
}
```

Redwood uses [Prisma](https://www.prisma.io/), a next-gen Node.js and TypeScript ORM, to talk to the database. Prisma's schema offers a declarative way of defining your app's data models. And Prisma [Migrate](https://www.prisma.io/migrate) uses that schema to make database migrations hassle-free:

```
yarn rw prisma migrate dev

# ...

? Enter a name for the new migration: › create posts
```

> `rw` is short for `redwood`

You'll be prompted for the name of your migration. `create posts` will do.

Now let's generate everything we need to perform all the CRUD (Create, Retrieve, Update, Delete) actions on our `Post` model:

```
yarn redwood g scaffold post
```

Navigate to http://localhost:8910/posts/new, fill in the title and body, and click "Save":

Did we just create a post in the database? Yup! With `yarn rw g scaffold <model>`, Redwood created all the pages, components, and services necessary to perform all CRUD actions on our posts table.

### Frontend first with Storybook

Don't know what your data models look like?
That's more than ok—Redwood integrates Storybook so that you can work on design without worrying about data.
Mockup, build, and verify your React components, even in complete isolation from the backend:

```
yarn rw storybook
```

Before you start, see if the CLI's `setup ui` command has your favorite styling library:

```
yarn rw setup ui --help
```

### Testing with Jest

It'd be hard to scale from side project to startup without a few tests.
Redwood fully integrates Jest with the front and the backends and makes it easy to keep your whole app covered by generating test files with all your components and services:

```
yarn rw test
```

To make the integration even more seamless, Redwood augments Jest with database [scenarios](https://redwoodjs.com/docs/testing.md#scenarios)  and [GraphQL mocking](https://redwoodjs.com/docs/testing.md#mocking-graphql-calls).

### Ship it

Redwood is designed for both serverless deploy targets like Netlify and Vercel and serverful deploy targets like Render and AWS:

```
yarn rw setup deploy --help
```

Don't go live without auth!
Lock down your front and backends with Redwood's built-in, database-backed authentication system ([dbAuth](https://redwoodjs.com/docs/authentication#self-hosted-auth-installation-and-setup)), or integrate with nearly a dozen third party auth providers:

```
yarn rw setup auth --help
```

### Next Steps

The best way to learn Redwood is by going through the comprehensive [tutorial](https://redwoodjs.com/docs/tutorial/foreword) and joining the community (via the [Discourse forum](https://community.redwoodjs.com) or the [Discord server](https://discord.gg/redwoodjs)).

### Quick Links

- Stay updated: read [Forum announcements](https://community.redwoodjs.com/c/announcements/5), follow us on [Twitter](https://twitter.com/redwoodjs), and subscribe to the [newsletter](https://redwoodjs.com/newsletter)
- [Learn how to contribute](https://redwoodjs.com/docs/contributing)
