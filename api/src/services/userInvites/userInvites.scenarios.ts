import { faker } from '@faker-js/faker'

const organizationId = '10a41f4f-6c53-4352-a02a-02605f6fbf9b'

export const standard = defineScenario({
  organization: {
    one: {
      data: {
        email: faker.internet.email(),
        name: faker.company.name(),
        id: organizationId,
      },
    },
  },
  user: {
    one: {
      data: {
        organizationId,
        email: faker.internet.email(),
        name: faker.name.fullName(),
        hashedPassword: '',
        salt: '',
      },
    },
  },
  userInvite: {
    one: {
      data: {
        code: '15232252342623',
        confirmed: false,
        email: 'abc@foo.com',
        createdAt: new Date().toISOString(),
      },
    },
  },
})

export type StandardScenario = typeof standard
