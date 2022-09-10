import { faker } from '@faker-js/faker'

import { mockHttpEvent, mockSignedWebhook } from '@redwoodjs/testing/api'

import { db } from 'src/lib/db'
import { stripe } from 'src/lib/stripe'

import { handler } from './stripeSubscription'
import type {
  ActiveScenario,
  CanceledScenario,
  ExpiredScenario,
  PastDueScenario,
  UnpaidScenario,
} from './stripeSubscription.scenarios'

// --

jest.mock('../../lib/stripe.ts')
const stripeMock = jest.mocked(stripe, true)

// --

type MockedSignedWebhookParams = Parameters<typeof mockHttpEvent>[0]

const mockWebhook = ({ body, ...a }: MockedSignedWebhookParams = {}) =>
  mockSignedWebhook({
    httpMethod: 'POST',
    secret: process.env.STRIPE_SUBSCRIPTION_SECRET,
    signatureHeader: 'stripe-signature',
    signatureType: 'timestampSchemeVerifier',
    payload: body,
    ...a,
  })

// --

describe('stripeSubscriptions function', () => {
  it('returns "405" status code when NOT invoked with the POST HTTP method', async () => {
    //
    let res = await handler(mockHttpEvent({ httpMethod: 'GET' }), undefined)
    expect(res.statusCode).toBe(405)
    //
    res = await handler(mockHttpEvent({ httpMethod: 'PUT' }), undefined)
    expect(res.statusCode).toBe(405)
    //
    res = await handler(mockHttpEvent({ httpMethod: 'DELETE' }), undefined)
    expect(res.statusCode).toBe(405)
  })

  describe('webhook verification', () => {
    it('returns "401" status code when "stripe-signature" is undefined', async () => {
      //
      const event = mockHttpEvent({ httpMethod: 'POST' })

      const res = await handler(event, undefined)

      expect(res.statusCode).toBe(401)
    })

    it('returns "401" status code when "stripe-signature" is signed with an invalid secret', async () => {
      //
      const event = mockSignedWebhook({
        httpMethod: 'POST',
        secret: 'MY INVALID SIGNATURE',
        signatureHeader: 'stripe-signature',
        signatureType: 'timestampSchemeVerifier',
      })

      const res = await handler(event, undefined)

      expect(res.statusCode).toBe(401)
    })

    it('returns "401" status code when "stripe-signature" is NOT signed with signature type "timestampSchemeVerifier"', async () => {
      //
      const event = mockSignedWebhook({
        httpMethod: 'POST',
        secret: process.env.STRIPE_SUBSCRIPTION_SECRET,
        signatureHeader: 'stripe-signature',
        signatureType: 'base64Sha256Verifier',
      })

      const res = await handler(event, undefined)

      expect(res.statusCode).toBe(401)
    })

    it('returns "401" status code when the signature is not at "Headers.stripe-signature"', async () => {
      //
      const event = mockSignedWebhook({
        httpMethod: 'POST',
        secret: process.env.STRIPE_SUBSCRIPTION_SECRET,
        signatureHeader: 'Secret-Signature',
        signatureType: 'timestampSchemeVerifier',
      })

      const res = await handler(event, undefined)

      expect(res.statusCode).toBe(401)
    })
  })

  describe('"body" validation', () => {
    it('returns "400" status code when "body" is undefined', async () => {
      //
      const res = await handler(mockWebhook({ body: undefined }), undefined)

      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse request-body')
    })

    it('returns "400" status code when "body" is an empty string', async () => {
      //
      const res = await handler(mockWebhook({ body: '' }), undefined)

      expect(res.statusCode).toBe(500)
    })

    it('returns "400" status code when "body.type" is NOT supported', async () => {
      //
      const res = await handler(
        mockWebhook({ body: JSON.stringify({ type: 'foo' }) }),
        undefined
      )

      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Unsupported webhook type')
    })

    it('returns "400" status code when "body.data.object.metadata.organizationId" is NOT a valid UUID', async () => {
      //
      let res = await handler(
        mockWebhook({
          body: JSON.stringify({
            data: { object: { metadata: { organizationId: undefined } } },
            type: 'customer.subscription.created',
          }),
        }),
        undefined
      )
      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse organizationId')
      //
      res = await handler(
        mockWebhook({
          body: JSON.stringify({
            data: { object: { metadata: { organizationId: 123 } } },
            type: 'customer.subscription.created',
          }),
        }),
        undefined
      )
      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse organizationId')
      //
      res = await handler(
        mockWebhook({
          body: JSON.stringify({
            data: { object: { metadata: { organizationId: '123' } } },
            type: 'customer.subscription.created',
          }),
        }),
        undefined
      )
      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse organizationId')
    })

    it('returns "400" status code when "body.data.object.status" is NOT a string', async () => {
      //
      let res = await handler(
        mockWebhook({
          body: JSON.stringify({
            type: 'customer.subscription.created',
            data: {
              object: {
                metadata: { organizationId: faker.datatype.uuid() },
                status: undefined,
              },
            },
          }),
        }),
        undefined
      )
      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse subscription status')
      //
      res = await handler(
        mockWebhook({
          body: JSON.stringify({
            type: 'customer.subscription.created',
            data: {
              object: {
                metadata: { organizationId: faker.datatype.uuid() },
                status: 123,
              },
            },
          }),
        }),
        undefined
      )
      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse subscription status')
    })
  })

  describe('"active" status', () => {
    scenario(
      'active',
      'returns "200" status code after completion',
      async (s: ActiveScenario) => {
        //
        const organizationId = s.organization.one.id

        const res = await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: { metadata: { organizationId }, status: 'active' },
              },
            }),
          }),
          undefined
        )

        expect(res.statusCode).toBe(200)
      }
    )

    scenario(
      'active',
      'sets the given organization\'s billing "subscriptionActive" to "true"',
      async (s: ActiveScenario) => {
        //
        const organizationId = s.organization.one.id

        await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: { metadata: { organizationId }, status: 'active' },
              },
            }),
          }),
          undefined
        )

        const res = await db.billing.findUnique({ where: { organizationId } })

        expect(res.subscriptionActive).toBe(true)
      }
    )

    scenario(
      'active',
      'sets the given organization\'s billing "subscriptionUnpaid" to "false"',
      async (s: ActiveScenario) => {
        //
        const organizationId = s.organization.one.id

        await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: { metadata: { organizationId }, status: 'active' },
              },
            }),
          }),
          undefined
        )

        const res = await db.billing.findUnique({ where: { organizationId } })

        expect(res.subscriptionUnpaid).toBe(false)
      }
    )
  })

  describe('"canceled" status', () => {
    beforeEach(() => stripeMock.customers.del.mockResolvedValue(undefined))
    afterEach(() => stripeMock.customers.del.mockClear())

    scenario(
      'canceled',
      'returns "200" status code after completion',
      async (s: CanceledScenario) => {
        //
        const organizationId = s.organization.one.id

        const res = await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: { metadata: { organizationId }, status: 'canceled' },
              },
            }),
          }),
          undefined
        )

        expect(res.statusCode).toBe(200)
      }
    )

    scenario(
      'canceled',
      'deletes the given organization',
      async (s: CanceledScenario) => {
        //
        const organizationId = s.organization.one.id

        await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: { metadata: { organizationId }, status: 'canceled' },
              },
            }),
          }),
          undefined
        )

        const perish = await db.organization.findUnique({
          where: { id: organizationId },
        })
        expect(perish).toBeNull()

        const exist = await db.organization.findUnique({
          where: { id: s.organization.two.id },
        })
        expect(exist).not.toBeNull()
      }
    )
  })

  describe('"incomplete_expired" status', () => {
    beforeEach(() => stripeMock.customers.del.mockResolvedValue(undefined))
    afterEach(() => stripeMock.customers.del.mockClear())

    scenario(
      'incomplete_expired',
      'returns "200" status code after completion',
      async (s: ExpiredScenario) => {
        //
        const organizationId = s.organization.one.id

        const res = await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: {
                  metadata: { organizationId },
                  status: 'incomplete_expired',
                },
              },
            }),
          }),
          undefined
        )

        expect(res.statusCode).toBe(200)
      }
    )

    scenario(
      'incomplete_expired',
      'deletes the given organization',
      async (s: ExpiredScenario) => {
        //
        const organizationId = s.organization.one.id

        await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: {
                  metadata: { organizationId },
                  status: 'incomplete_expired',
                },
              },
            }),
          }),
          undefined
        )

        const perish = await db.organization.findUnique({
          where: { id: organizationId },
        })
        expect(perish).toBeNull()

        const exist = await db.organization.findUnique({
          where: { id: s.organization.two.id },
        })
        expect(exist).not.toBeNull()
      }
    )
  })

  describe('"past_due" status', () => {
    scenario(
      'past_due',
      'returns "200" status code after completion',
      async (s: PastDueScenario) => {
        //
        const organizationId = s.organization.one.id

        const res = await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: {
                  metadata: { organizationId },
                  status: 'incomplete_expired',
                },
              },
            }),
          }),
          undefined
        )

        expect(res.statusCode).toBe(200)
      }
    )

    scenario(
      'past_due',
      'sets the given organization\'s billing "subscriptionActive" to "false"',
      async (s: PastDueScenario) => {
        //
        const organizationId = s.organization.one.id

        const pre = await db.billing.findUnique({ where: { organizationId } })

        await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: {
                  metadata: { organizationId },
                  status: 'past_due',
                },
              },
            }),
          }),
          undefined
        )

        const post = await db.billing.findUnique({ where: { organizationId } })

        expect(pre.subscriptionActive).toBe(true)
        expect(post.subscriptionActive).toBe(false)
      }
    )
  })

  describe('"unpaid" status', () => {
    scenario(
      'unpaid',
      'returns "200" status code after completion',
      async (s: UnpaidScenario) => {
        //
        const organizationId = s.organization.one.id

        const res = await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: {
                  metadata: { organizationId },
                  status: 'unpaid',
                },
              },
            }),
          }),
          undefined
        )

        expect(res.statusCode).toBe(200)
      }
    )

    scenario(
      'unpaid',
      'sets the given organization\'s billing "subscriptionUnpaid" to "true"',
      async (s: UnpaidScenario) => {
        //
        const organizationId = s.organization.one.id

        const pre = await db.billing.findUnique({ where: { organizationId } })

        await handler(
          mockWebhook({
            body: JSON.stringify({
              type: 'customer.subscription.created',
              data: {
                object: {
                  metadata: { organizationId },
                  status: 'unpaid',
                },
              },
            }),
          }),
          undefined
        )

        const post = await db.billing.findUnique({ where: { organizationId } })

        expect(pre.subscriptionUnpaid).toBe(false)
        expect(post.subscriptionUnpaid).toBe(true)
      }
    )
  })
})
