import { faker } from '@faker-js/faker'

export const user = defineScenario({
  user: {
    one: {
      data: {
        email: faker.internet.email(),
        name: faker.name.fullName(),
        hashedPassword: '',
        salt: '',
      },
    },
  },
})

export type UserScenario = typeof user

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const existingOrganization = defineScenario<any>({
  user: {
    one: {
      data: {
        email: faker.internet.email(),
        name: faker.name.fullName(),
        hashedPassword: '',
        salt: '',
      },
    },
  },
  organization: {
    one: (s) => ({
      data: {
        email: faker.internet.email(),
        name: faker.name.fullName(),
        users: {
          connect: {
            id: s.user.one.id,
          },
        },
      },
    }),
  },
  billing: {
    one: (s) => ({
      data: {
        customerId: '123',
        organizationId: s.organization.one.id,
      },
    }),
  },
})

export type ExistingOrganizationScenario = typeof existingOrganization
