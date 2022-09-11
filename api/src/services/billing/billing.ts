import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { stripe } from 'src/lib/stripe'

export const createSetupIntent: QueryResolvers['createSetupIntent'] =
  async () => {
    const billing = await db.billing.findUnique({
      where: { organizationId: context.currentUser.organizationId },
    })

    // https://stripe.com/docs/payments/setup-intents
    return stripe.setupIntents.create({
      customer: billing.customerId,
      metadata: { organizationId: context.currentUser.organizationId },
      payment_method_types: ['card'],
    })
  }
