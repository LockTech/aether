import { db } from 'src/lib/db'
import { stripe } from 'src/lib/stripe'

import { createSetupIntent } from './billing'
import { StandardScenario } from './billing.scenarios'

jest.mock('../../lib/stripe')
const stripeMock = jest.mocked(stripe, true)

describe('billing', () => {
  describe('createSetupIntent', () => {
    beforeEach(() => {
      stripeMock.setupIntents.create.mockResolvedValue(undefined)
    })
    afterEach(() => {
      stripeMock.setupIntents.create.mockClear()
    })

    scenario(
      'creates a setup intent using the Stripe API',
      async (s: StandardScenario) => {
        const organizationId = s.organization.one.id

        // @ts-expect-error Partial mock
        mockCurrentUser({ organizationId })

        await createSetupIntent()

        const billing = await db.billing.findUnique({
          where: { organizationId },
        })

        expect(stripe.setupIntents.create).toHaveBeenCalledTimes(1)
        expect(stripe.setupIntents.create).toHaveBeenCalledWith({
          customer: billing.customerId,
          metadata: { organizationId },
          payment_method_types: ['card'],
        })
      }
    )

    scenario(
      'returns the created SetupIntent\'s "client_secret"',
      async (s: StandardScenario) => {
        // @ts-expect-error Partial mock
        mockCurrentUser({ organizationId: s.organization.one.id })

        // @ts-expect-error partial mock
        stripeMock.setupIntents.create.mockResolvedValue({
          client_secret: 'Im the secret',
        })

        const res = await createSetupIntent()
        expect(res.client_secret).toBe('Im the secret')
      }
    )
  })
})
