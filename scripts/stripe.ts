import concurrently from 'concurrently'

/**
 * [Forwards Stripe webhooks](https://stripe.com/docs/webhooks/test#webhook-test-cli) to the local instance of the application's API server.
 * - `setup_intent.*` — Forwards to `http://localhost:8911/stripeSetupIntent`
 * - `customer.subscription.*` — Forwards to `http://localhost:8911/stripeSubscription`
 */
export default () => {
  concurrently([
    {
      name: 'Setup',
      prefixColor: 'magenta',
      command:
        'stripe listen -e setup_intent.succeeded -f http://localhost:8911/stripeSetupIntent',
    },
    {
      name: 'Subscription',
      prefixColor: 'cyan',
      command:
        'stripe listen -e customer.subscription.created,customer.subscription.deleted,customer.subscription.updated -f http://localhost:8911/stripeSubscription',
    },
  ])
}
