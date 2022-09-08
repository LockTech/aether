import { faker } from '@faker-js/faker'
import type { SignupMutation } from 'types/graphql'

export const standard = (): SignupMutation => ({
  signupUser: { id: faker.datatype.uuid() },
})

mockGraphQLMutation('ResendSignupInvitation', (_, { ctx: { delay } }) => {
  delay(1200)
  return {}
})

mockGraphQLMutation('Signup', (_, { ctx: { delay } }) => {
  delay(1200)
  return standard()
})
