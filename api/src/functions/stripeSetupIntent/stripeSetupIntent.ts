import type { APIGatewayEvent, Context } from 'aws-lambda'
import { validate as validateUUID } from 'uuid'

import { isDevelopment } from '@redwoodjs/api/logger'
import { verifyEvent, WebhookVerificationError } from '@redwoodjs/api/webhooks'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import Sentry from 'src/lib/sentry'
import { stripe } from 'src/lib/stripe'

const SUPPORTED_WEBHOOK_TYPES = ['setup_intent.succeeded']

/**
 * Webhook handler for [the Stripe `setup_intent.succeeded` event](https://stripe.com/docs/cli/trigger#trigger-event-setup_intent_succeeded). This webhook will be invoked _after_ an organization's administrator has successfully setup payment information — resulting in the creation of the organization's subscription, granting them access to the application.
 */
export const handler = async (event: APIGatewayEvent, _ctx: Context) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405 }

    !isDevelopment &&
      verifyEvent('timestampSchemeVerifier', {
        event,
        secret: process.env.STRIPE_SETUP_INTENT_SECRET,
        options: { signatureHeader: 'stripe-signature' },
      })

    const body = JSON.parse(event.body)
    if (!body) return { statusCode: 400, body: 'Failed to parse request-body' }

    if (!SUPPORTED_WEBHOOK_TYPES.includes(body.type))
      return { statusCode: 400, body: 'Unsupported event-type' }

    const organizationId: string = body.data?.object?.metadata?.organizationId
    if (!validateUUID(organizationId))
      return { statusCode: 400, body: 'Failed to parse organizationId' }

    const paymentMethod: string = body.data?.object?.payment_method
    if (typeof paymentMethod !== 'string')
      return { statusCode: 400, body: 'Failed to parse payment method' }

    const billing = await db.billing.findUnique({ where: { organizationId } })
    if (!billing) return { statusCode: 400, body: 'Unknown organizationId' }

    await stripe.customers.update(billing.customerId, {
      invoice_settings: { default_payment_method: paymentMethod },
    })

    const subscription = await stripe.subscriptions.create({
      customer: billing.customerId,
      payment_behavior: 'default_incomplete',
      metadata: { organizationId },
      items: [{ price: process.env.STRIPE_SUBSCRIPTION_PRICE }],
    })

    await db.billing.update({
      where: { customerId: billing.customerId },
      data: {
        subscriptionActive: true,
        subscriptionId: subscription.id,
      },
    })

    return { statusCode: 200 }
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      logger.warn({ err }, 'Failed to validate Stripe setup intent webhook.')
      return { statusCode: 401 }
    }

    logger.error({ err }, 'Error handling setup intent webhook.')

    Sentry.captureException(err)

    return { statusCode: 500 }
  }
}
