import { faker } from '@faker-js/faker'

import { mockHttpEvent, mockSignedWebhook } from '@redwoodjs/testing/api'

import { db } from 'src/lib/db'
import { stripe } from 'src/lib/stripe'

import { handler } from './stripeSetupIntent'
import type { StandardScenario } from './stripeSetupIntent.scenarios'

jest.mock('../../lib/stripe.ts')
const stripeMock = jest.mocked(stripe, true)

type MockedSignedWebhookParams = Parameters<typeof mockHttpEvent>[0]

const mockWebhook = (params: MockedSignedWebhookParams = {}) =>
  mockSignedWebhook({
    httpMethod: 'POST',
    secret: process.env.STRIPE_SETUP_INTENT_SECRET,
    signatureHeader: 'stripe-signature',
    signatureType: 'timestampSchemeVerifier',
    ...params,
  })

describe('stripeSetupIntent function', () => {
  beforeEach(() => {
    stripeMock.customers.update.mockResolvedValue(undefined)
    // @ts-expect-error Partial mock
    stripeMock.subscriptions.create.mockResolvedValue({ id: '123' })
  })
  afterEach(() => {
    stripeMock.customers.update.mockClear()
    stripeMock.subscriptions.create.mockClear()
  })

  it('returns "405" status code when NOT invoked with the POST HTTP method', async () => {
    let res = await handler(mockHttpEvent({ httpMethod: 'GET' }), undefined)
    expect(res.statusCode).toBe(405)

    res = await handler(mockHttpEvent({ httpMethod: 'PUT' }), undefined)
    expect(res.statusCode).toBe(405)

    res = await handler(mockHttpEvent({ httpMethod: 'DELETE' }), undefined)
    expect(res.statusCode).toBe(405)
  })

  scenario(
    'returns "200" status code after completing successfully',
    async (s: StandardScenario) => {
      const res = await handler(
        mockWebhook({
          payload: JSON.stringify({
            type: 'setup_intent.succeeded',
            data: {
              object: {
                metadata: { organizationId: s.organization.one.id },
                payment_method: 'hello',
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
    'updates the organization\'s "default_payment_method"',
    async (s: StandardScenario) => {
      const organizationId = s.organization.one.id
      const payment_method = faker.random.alphaNumeric(10)

      await handler(
        mockWebhook({
          payload: JSON.stringify({
            type: 'setup_intent.succeeded',
            data: {
              object: {
                metadata: { organizationId },
                payment_method,
              },
            },
          }),
        }),
        undefined
      )

      const billing = await db.billing.findUnique({ where: { organizationId } })

      expect(stripe.customers.update).toHaveBeenCalledTimes(1)
      expect(stripe.customers.update).toHaveBeenCalledWith(billing.customerId, {
        invoice_settings: { default_payment_method: payment_method },
      })
    }
  )

  scenario(
    "creates the organization's subscription",
    async (s: StandardScenario) => {
      const organizationId = s.organization.one.id
      const subscriptionId = faker.random.alphaNumeric(10)

      // @ts-expect-error Partial mock
      stripeMock.subscriptions.create.mockResolvedValue({ id: subscriptionId })

      await handler(
        mockWebhook({
          payload: JSON.stringify({
            type: 'setup_intent.succeeded',
            data: {
              object: {
                metadata: { organizationId },
                payment_method: 'hello',
              },
            },
          }),
        }),
        undefined
      )

      const billing = await db.billing.findUnique({ where: { organizationId } })

      expect(billing.subscriptionId).toBe(subscriptionId)
      expect(stripe.subscriptions.create).toHaveBeenCalledTimes(1)
      expect(stripe.subscriptions.create).toHaveBeenCalledWith({
        customer: billing.customerId,
        payment_behavior: 'default_incomplete',
        metadata: { organizationId },
        items: [],
      })
    }
  )

  describe('webhook verification', () => {
    it('returns "401" status code when "stripe-signature" is undefined', async () => {
      const event = mockHttpEvent({ httpMethod: 'POST' })

      const res = await handler(event, undefined)

      expect(res.statusCode).toBe(401)
    })

    it('returns "401" status code when "stripe-signature" is signed with an invalid secret', async () => {
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
      const res = await handler(mockWebhook({ payload: undefined }), undefined)

      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse request-body')
    })

    it('returns "400" status code when "body" is an empty string', async () => {
      const res = await handler(mockWebhook({ payload: '' }), undefined)

      expect(res.statusCode).toBe(500)
    })

    it('returns "400" status code when "body.type" is NOT supported', async () => {
      const res = await handler(
        mockWebhook({ payload: JSON.stringify({ type: 'foo' }) }),
        undefined
      )

      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Unsupported event-type')
    })

    it('returns "400" status code when "body.data.metadata.organizationId" is NOT a valid UUID', async () => {
      let res = await handler(
        mockWebhook({
          payload: JSON.stringify({
            data: { object: { metadata: { organizationId: undefined } } },
            type: 'setup_intent.succeeded',
          }),
        }),
        undefined
      )
      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse organizationId')

      res = await handler(
        mockWebhook({
          payload: JSON.stringify({
            data: { object: { metadata: { organizationId: 123 } } },
            type: 'setup_intent.succeeded',
          }),
        }),
        undefined
      )
      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse organizationId')

      res = await handler(
        mockWebhook({
          payload: JSON.stringify({
            data: { object: { metadata: { organizationId: '123' } } },
            type: 'setup_intent.succeeded',
          }),
        }),
        undefined
      )
      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Failed to parse organizationId')
    })

    it('returns "400" status code when "body.data.metadata.organizationId" does NOT belong to a known organization', async () => {
      const res = await handler(
        mockWebhook({
          payload: JSON.stringify({
            data: {
              object: {
                metadata: { organizationId: faker.datatype.uuid() },
                payment_method: 'hello',
              },
            },
            type: 'setup_intent.succeeded',
          }),
        }),
        undefined
      )

      expect(res.statusCode).toBe(400)
      expect(res.body).toBe('Unknown organizationId')
    })
  })
})
