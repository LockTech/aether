import { faker } from '@faker-js/faker'

import { sendEmail } from 'src/lib/email'
import { randomStr } from 'src/util/random'

import { confirmUserInvite, inviteUser, signupUser } from './userInvites'
import type { StandardScenario } from './userInvites.scenarios'

jest.mock('../../lib/email')
const emailMock = jest.mocked(sendEmail)

jest.mock('../../util/random')
const randomMock = jest.mocked(randomStr)

describe('userInvites', () => {
  beforeEach(() => {
    emailMock.mockResolvedValue()
    randomMock.mockReturnValue('42')
  })

  afterEach(() => {
    emailMock.mockClear()
    randomMock.mockClear()
  })

  describe('confirmUserInvite', () => {
    scenario(
      'confirms the invitation code sent to the given email',
      async (s: StandardScenario) => {
        const code = s.userInvite.one.code
        const email = s.userInvite.one.email

        const res = await confirmUserInvite(code, email)

        expect(res.confirmed).toBe(true)

        expect(res.code).toBe(code)
        expect(res.email).toBe(email)
      }
    )

    scenario(
      'rejects if the given email does not have a pending invitation',
      async (s: StandardScenario) => {
        const code = s.userInvite.one.code
        const email = faker.internet.email()

        await expect(() => confirmUserInvite(code, email)).rejects.toThrow(
          'Invitation could not be validated.'
        )
      }
    )

    scenario(
      'rejects if the given code does not belong to an invited email',
      async (s: StandardScenario) => {
        const code = '123'
        const email = s.userInvite.one.email

        await expect(() => confirmUserInvite(code, email)).rejects.toThrow(
          'Invitation could not be validated.'
        )
      }
    )
  })

  describe('inviteUser', () => {
    scenario(
      'invites to the current organization',
      async (s: StandardScenario) => {
        const email = faker.internet.email()
        const name = faker.name.fullName()
        const organizationId = s.user.one.organizationId
        const roles = 'MEMBER'

        // @ts-expect-error Partial user mock
        mockCurrentUser({ organizationId })

        const res = await inviteUser({ input: { email, name, roles } })

        expect(res.confirmed).toBe(false)
        expect(res.email).toBe(email)
        expect(res.name).toBe(name)
        expect(res.organizationId).toBe(organizationId)
        expect(res.roles).toBe(roles)
      }
    )

    scenario(
      'sends an invite-invitation to the given email',
      async (s: StandardScenario) => {
        const email = faker.internet.email()
        const inviter = faker.name.fullName()
        const name = faker.name.fullName()

        // @ts-expect-error Partial user mock
        mockCurrentUser({
          name: inviter,
          organizationId: s.user.one.organizationId,
        })

        await inviteUser({ input: { email, name, roles: 'MEMBER' } })

        expect(emailMock).toHaveBeenCalledTimes(1)
        expect(emailMock).toHaveBeenCalledWith('invite', email, {
          inviter,
          link: `${process.env.BASE_URL}/confirm?code=42&email=${email}&name=${name}`,
          name,
        })
      }
    )

    scenario(
      'generates a random invitation code',
      async (s: StandardScenario) => {
        // @ts-expect-error Partial user mock
        mockCurrentUser({ organizationId: s.user.one.organizationId })

        const res = await inviteUser({
          input: {
            email: faker.internet.email(),
            name: faker.name.fullName(),
            roles: 'MEMBER',
          },
        })

        expect(randomMock).toHaveBeenCalledTimes(1)
        expect(randomMock).toHaveBeenCalledWith()

        expect(res.code).toBe('42')
      }
    )

    scenario(
      'rejects if the email has been invited in X days',
      async (s: StandardScenario) => {
        const email = s.userInvite.one.email

        // @ts-expect-error Partial user mock
        mockCurrentUser({ organizationId: s.user.one.organizationId })

        await expect(() =>
          inviteUser({
            input: {
              email,
              name: faker.name.fullName(),
              roles: 'MEMBER',
            },
          })
        ).rejects.toThrow('Email has already been invited.')
      }
    )

    scenario(
      'rejects if the email belongs to an existing user',
      async (s: StandardScenario) => {
        const email = s.user.one.email

        // @ts-expect-error Partial user mock
        mockCurrentUser({ organizationId: s.user.one.organizationId })

        await expect(() =>
          inviteUser({
            input: {
              email,
              name: faker.name.fullName(),
              roles: 'MEMBER',
            },
          })
        ).rejects.toThrow('Email has already been invited.')
      }
    )
  })

  describe('signupUser', () => {
    scenario(
      'invites the given email to the application',
      async (_: StandardScenario) => {
        const email = faker.internet.email()

        const res = await signupUser({ input: { email } })

        expect(res.confirmed).toBe(false)
        expect(res.email).toBe(email)
      }
    )

    scenario(
      'sends a signup-invitation to the given email',
      async (_: StandardScenario) => {
        const email = faker.internet.email()

        await signupUser({ input: { email } })

        expect(emailMock).toHaveBeenCalledTimes(1)
        expect(emailMock).toHaveBeenCalledWith('signup', email, {
          link: `${process.env.BASE_URL}/confirm?code=42&email=${email}&signup=true`,
        })
      }
    )

    scenario(
      'generates a random invitation code',
      async (_: StandardScenario) => {
        const res = await signupUser({
          input: {
            email: faker.internet.email(),
          },
        })

        expect(randomMock).toBeCalledTimes(1)
        expect(randomMock).toBeCalledWith()

        expect(res.code).toBe('42')
      }
    )

    scenario(
      'rejects if the email has been invited in X days',
      async (s: StandardScenario) => {
        const email = s.userInvite.one.email

        await expect(() => signupUser({ input: { email } })).rejects.toThrow(
          'Email has already been invited.'
        )
      }
    )

    scenario(
      'rejects if the email belongs to an existing user',
      async (s: StandardScenario) => {
        const email = s.user.one.email

        // @ts-expect-error Partial user mock
        mockCurrentUser({ organizationId: s.user.one.organizationId })

        await expect(() => signupUser({ input: { email } })).rejects.toThrow(
          'Email has already been invited.'
        )
      }
    )
  })
})
