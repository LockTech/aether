import type { MutationResolvers, OrganizationResolvers } from 'types/graphql'

import { validateUniqueness } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { stripe } from 'src/lib/stripe'
import { validateName } from 'src/validators/organization'
import { validateEmail } from 'src/validators/user'
import { validateUUID } from 'src/validators/uuid'

export const createOrganization: MutationResolvers['createOrganization'] =
  async ({ input: { email, name } }) => {
    validateEmail(email)
    validateName(name)

    return validateUniqueness(
      'organization',
      { OR: [{ email }, { name }] },
      {
        message:
          'An organization with that name or email address already exist.',
      },
      async (prisma) => {
        const customer = await stripe.customers.create({ email, name })

        const res = await prisma.user.update({
          select: { organization: true },
          where: { id: context.currentUser.id },
          data: {
            organization: {
              create: {
                email,
                name,
                billing: {
                  create: {
                    customerId: customer.id,
                  },
                },
              },
            },
          },
        })

        await stripe.customers.update(customer.id, {
          metadata: {
            organizationId: res.organization.id,
          },
        })

        return res.organization
      }
    )
  }

interface deleteOrganizationArgs {
  id?: string
}

export const deleteOrganization = async ({
  id = context?.currentUser?.organizationId,
}: deleteOrganizationArgs = {}) => {
  id && validateUUID(id, 'Received an invalid ID.')

  const res = await db.organization.delete({
    include: { billing: true },
    where: { id },
  })

  await stripe.customers.del(res.billing.customerId)

  return res
}

export const Organization: OrganizationResolvers = {
  users: (_, { root }) =>
    db.user.findMany({ where: { organizationId: root.id } }),
  userInvites: (_, { root }) =>
    db.userInvite.findMany({ where: { organizationId: root.id } }),
}
