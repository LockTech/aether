import type { APIGatewayEvent, Context } from 'aws-lambda'
import type { Stripe } from 'stripe'
import { validate as validateUUID } from 'uuid'

import { isDevelopment } from '@redwoodjs/api/logger'
import { verifyEvent, WebhookVerificationError } from '@redwoodjs/api/webhooks'

import { db } from 'src/lib/db'
import { logger } from 'src/lib/logger'
import { deleteOrganization } from 'src/services/organizations'

const SUPPORTED_WEBHOOK_TYPES = [
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]

/**
 * Webhook handler for Stripe _subscription_ events, particularly:
 *
 * - [`customer.subscription.created`](https://stripe.com/docs/cli/trigger#trigger-event-customer_subscription_created)
 * - [`customer.subscription.deleted`](https://stripe.com/docs/cli/trigger#trigger-event-customer_subscription_deleted)
 * - [`customer.subscription.updated`](https://stripe.com/docs/cli/trigger#trigger-event-customer_subscription_updated)
 *
 * These events are used to update an organization's `Billing` to match [the `status` of their subscription](https://stripe.com/docs/api/subscriptions/object#subscription_object-status).
 */
export const handler = async (event: APIGatewayEvent, _ctx: Context) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405 }

    !isDevelopment &&
      verifyEvent('timestampSchemeVerifier', {
        event,
        secret: process.env.STRIPE_SUBSCRIPTION_SECRET,
        options: { signatureHeader: 'stripe-signature' },
      })

    const body = JSON.parse(event.body)
    if (!body) return { statusCode: 400, body: 'Failed to parse request-body' }

    if (!SUPPORTED_WEBHOOK_TYPES.includes(body.type))
      return { statusCode: 400, body: 'Unsupported webhook type' }

    const organizationId: string = body.data?.object?.metadata?.organizationId
    if (!validateUUID(organizationId))
      return { statusCode: 400, body: 'Failed to parse organizationId' }

    const status: Stripe.Subscription.Status = body.data?.object?.status
    if (typeof status !== 'string')
      return { statusCode: 400, body: 'Failed to parse subscription status' }

    switch (status) {
      case 'active': {
        await db.billing.update({
          data: { subscriptionActive: true, subscriptionUnpaid: false },
          where: { organizationId },
        })

        break
      }

      case 'canceled': {
        await deleteOrganization({ id: organizationId })

        break
      }

      case 'incomplete_expired': {
        await deleteOrganization({ id: organizationId })

        break
      }

      case 'past_due': {
        await db.billing.update({
          data: { subscriptionActive: false },
          where: { organizationId },
        })

        break
      }

      case 'unpaid': {
        await db.billing.update({
          data: { subscriptionUnpaid: true },
          where: { organizationId },
        })

        break
      }
    }

    return { statusCode: 200 }
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      logger.warn({ err }, 'Failed to validate subscription webhook.')
      return { statusCode: 401 }
    }

    logger.error({ err }, 'Error handling subscription webhook.')

    return { statusCode: 500 }
  }
}
