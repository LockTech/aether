import { faker } from '@faker-js/faker'
import type { OrganizationCreate } from 'types/graphql'

// --

const standard = (): OrganizationCreate => ({
  createOrganization: {
    id: faker.datatype.uuid(),
  },
})

mockGraphQLMutation('OrganizationCreate', (_, { ctx: { delay } }) => {
  delay(1200)
  return standard()
})
