import { faker } from '@faker-js/faker'

import { db } from 'src/lib/db'
import { stripe } from 'src/lib/stripe'

import { createOrganization, deleteOrganization } from './organizations'
import type {
  ExistingOrganizationScenario,
  UserScenario,
} from './organizations.scenarios'

jest.mock('../../lib/stripe')
const stripeMocked = jest.mocked(stripe, true)

describe('organizations', () => {
  beforeEach(() => {
    // @ts-expect-error Partial mock
    stripeMocked.customers.create.mockResolvedValue({ id: '123' })
    stripeMocked.customers.update.mockResolvedValue(undefined)
    stripeMocked.customers.del.mockResolvedValue(undefined)
  })

  afterEach(() => {
    stripeMocked.customers.create.mockClear()
    stripeMocked.customers.update.mockClear()
    stripeMocked.customers.del.mockClear()
  })

  describe('createOrganization', () => {
    scenario(
      'user',
      'creates a new organization with the given "email" and "name"',
      async (s: UserScenario) => {
        // @ts-expect-error Partial mock
        mockCurrentUser({ id: s.user.one.id })

        const email = faker.internet.email()
        const name = faker.name.fullName()

        const res = await createOrganization({ input: { email, name } })

        expect(res.id).toBeDefined()
        expect(res.email).toBe(email)
        expect(res.name).toBe(name)
      }
    )

    scenario(
      'user',
      'creates a Stripe customer with the given "email" and "name"',
      async (s: UserScenario) => {
        // @ts-expect-error Partial mock
        mockCurrentUser({ id: s.user.one.id })

        const email = faker.internet.email()
        const name = faker.name.fullName()

        await createOrganization({ input: { email, name } })

        expect(stripe.customers.create).toHaveBeenCalledTimes(1)
        expect(stripe.customers.create).toBeCalledWith({ email, name })
      }
    )

    scenario(
      'user',
      'creates the Billing model, associating the Stripe customer\'s "id"',
      async (s: UserScenario) => {
        // @ts-expect-error Partial mock
        mockCurrentUser({ id: s.user.one.id })

        // @ts-expect-error Partial mock
        stripeMocked.customers.create.mockResolvedValue({ id: '4444' })

        const organization = await createOrganization({
          input: {
            email: faker.internet.email(),
            name: faker.name.fullName(),
          },
        })

        const billing = await db.billing.findUnique({
          where: { organizationId: organization.id },
        })

        expect(billing.id).toBeDefined()
        expect(billing.customerId).toBe('4444')
      }
    )

    scenario(
      'user',
      'associates the created organization\'s "id" with the Stripe customer',
      async (s: UserScenario) => {
        // @ts-expect-error Partial mock
        mockCurrentUser({ id: s.user.one.id })

        // @ts-expect-error Partial mock
        stripeMocked.customers.create.mockResolvedValue({ id: '4444' })

        const res = await createOrganization({
          input: { email: faker.internet.email(), name: faker.name.fullName() },
        })

        expect(stripe.customers.update).toBeCalledTimes(1)
        expect(stripe.customers.update).toBeCalledWith('4444', {
          metadata: { organizationId: res.id },
        })
      }
    )
  })

  describe('deleteOrganization', () => {
    scenario(
      'existingOrganization',
      "Removes the currentUser's organization",
      async (s: ExistingOrganizationScenario) => {
        // @ts-expect-error Partial mock
        mockCurrentUser({ organizationId: s.organization.one.id })

        const res = await deleteOrganization()

        const assert = await db.organization.findUnique({
          where: { id: s.organization.one.id },
        })

        expect(res.id).toBe(s.organization.one.id)
        expect(assert).toBeNull()
      }
    )

    scenario(
      'existingOrganization',
      "Removes the organization's Stripe customer",
      async (s: ExistingOrganizationScenario) => {
        // @ts-expect-error Partial mock
        mockCurrentUser({ organizationId: s.organization.one.id })

        await deleteOrganization()

        expect(stripe.customers.del).toHaveBeenCalledTimes(1)
        expect(stripe.customers.del).toHaveBeenCalledWith(
          s.billing.one.customerId
        )
      }
    )

    scenario(
      'existingOrganization',
      "Removes the organization's associated resources",
      async (s: ExistingOrganizationScenario) => {
        // @ts-expect-error Partial mock
        mockCurrentUser({ organizationId: s.organization.one.id })

        await deleteOrganization()

        const user = await db.user.findUnique({ where: { id: s.user.one.id } })
        const billing = await db.billing.findUnique({
          where: { id: s.billing.one.id },
        })

        expect(user).toBeNull()
        expect(billing).toBeNull()
      }
    )
  })
})
