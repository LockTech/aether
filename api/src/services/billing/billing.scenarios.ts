import { faker } from '@faker-js/faker'
import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: {
      data: {
        email: faker.internet.email(),
        name: faker.company.name(),
        billing: {
          create: {
            customerId: faker.finance.bic(),
            subscriptionActive: false,
            subscriptionUnpaid: false,
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
