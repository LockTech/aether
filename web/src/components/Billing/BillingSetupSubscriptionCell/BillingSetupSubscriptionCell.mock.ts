import type { BillingSetupSubscription } from 'types/graphql'

export const standard =
  (/* vars, { ctx, req } */): BillingSetupSubscription => ({
    intent: {
      client_secret: '',
    },
  })

mockGraphQLQuery('BillingSetupSubscription', (_, { ctx: { delay } }) => {
  delay(1200)
  return standard()
})
