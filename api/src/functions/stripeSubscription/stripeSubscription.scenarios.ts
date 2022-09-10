import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

// --

export const active = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: {
      data: {
        email: faker.internet.email(),
        name: faker.company.name(),
        billing: {
          create: {
            customerId: faker.finance.bic(),
            subscriptionActive: false,
            subscriptionUnpaid: true,
          },
        },
      },
    },
  },
})

export type ActiveScenario = typeof active

// --

export const canceled = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: {
      data: {
        email: faker.internet.email(),
        name: faker.company.name(),
        billing: {
          create: {
            customerId: faker.finance.bic(),
            subscriptionActive: true,
            subscriptionId: '123',
          },
        },
      },
    },
    two: {
      data: {
        email: faker.internet.email(),
        name: faker.company.name(),
        billing: {
          create: {
            customerId: faker.finance.bic(),
            subscriptionActive: true,
            subscriptionId: '123',
          },
        },
      },
    },
  },
})

export type CanceledScenario = typeof canceled

// --

export const incomplete_expired = defineScenario<Prisma.OrganizationCreateArgs>(
  {
    organization: {
      one: {
        data: {
          email: faker.internet.email(),
          name: faker.company.name(),
          billing: {
            create: {
              customerId: faker.finance.bic(),
            },
          },
        },
      },
      two: {
        data: {
          email: faker.internet.email(),
          name: faker.company.name(),
          billing: {
            create: {
              customerId: faker.finance.bic(),
            },
          },
        },
      },
    },
  }
)

export type ExpiredScenario = typeof incomplete_expired

// --

export const unpaid = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: {
      data: {
        email: faker.internet.email(),
        name: faker.company.name(),
        billing: {
          create: {
            customerId: faker.finance.bic(),
            subscriptionActive: true,
            subscriptionId: '123',
            subscriptionUnpaid: false,
          },
        },
      },
    },
  },
})

export type UnpaidScenario = typeof unpaid

// --

export const past_due = defineScenario<Prisma.OrganizationCreateArgs>({
  organization: {
    one: {
      data: {
        email: faker.internet.email(),
        name: faker.company.name(),
        billing: {
          create: {
            customerId: faker.finance.bic(),
            subscriptionActive: true,
            subscriptionId: '123',
            subscriptionUnpaid: false,
          },
        },
      },
    },
  },
})

export type PastDueScenario = typeof past_due
