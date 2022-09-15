# Stripe

The [Stripe](https://stripe.com) platform provides the Aether boilerplate payment processing as well as subscription management functionality.

## Price

In order to create a subscription, you will need to [provide a price](https://stripe.com/docs/api/prices) using the `STRIPE_SUBSCRIPTION_PRICE` variable.

## Webhooks

Two [webhooks should be configured using Stripe](https://stripe.com/docs/webhooks), pointing to the following [endpoints](https://redwoodjs.com/docs/serverless-functions) and triggered by the [corresponding events](https://stripe.com/docs/webhooks/stripe-events):

- `/stripeSetupIntent`
  - `setup_intent.succeeded`
- `/stripeSubscription`
  - `customer.subscription.created`
  - `customer.subscription.deleted`
  - `customer.subscription.updated`

Invocations of these functions will be used to start and update an organization's subscription. The `STRIPE_SETUP_INTENT_SECRET` and `STRIPE_SUBSCRIPTION_SECRET` variables will be used to verify the origin of the [webhook's signature](https://stripe.com/docs/webhooks/signatures) — used to authenticate requests were sent by Stripe.

