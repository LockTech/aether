import type { Prisma, UserInvite } from '@prisma/client'
import type { MutationResolvers } from 'types/graphql'

import { validate, validateUniqueness } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { sendEmail } from 'src/lib/email'
import { randomStr, validateRandomStr } from 'src/util/random'
import { validateEmail, validateName, validateRoles } from 'src/validators/user'

// The amount of time an invitation will be valid, in milliseconds (default is 7 days)
const INVITE_DAYS_VALID = 1000 * 60 * 60 * 24 * 7

/**
 * Generate an invite or signup link for the given `code`, `email`, and `name` combinations.
 */
const generateInviteLink = (
  code: string,
  email: string,
  name: string | undefined,
  signup: boolean
) => {
  return `${process.env.BASE_URL}/confirm?code=${code}&email=${email}${
    name ? `&name=${name}` : ''
  }${signup ? '&signup=true' : ''}`
}

/**
 * Returns common Prisma `where` arguments, used to determine an invite's validity.
 */
const inviteWhere = () => {
  const confirmed = false

  const lt = new Date()
  const gt = new Date(lt.valueOf() - INVITE_DAYS_VALID)
  const createdAt = { gt, lt }

  return { confirmed, createdAt }
}

/**
 * Creates a {@link UserInvite}, storing it in the configured database.
 *
 * Makes use of {@link validateUniqueness} to ensure:
 *
 * 1. The email does not have a pending invitation.
 * 2. The email is not in-use by an existing `User`.
 */
const createInvite = (
  email: string,
  data: Prisma.UserInviteUncheckedCreateInput
) => {
  const { createdAt } = inviteWhere()

  return validateUniqueness(
    'userInvite',
    { createdAt, email },
    { message: 'Email has already been invited.' },
    () =>
      validateUniqueness(
        'user',
        { email },
        // Note: the same error-message is used (as above) to prevent
        // notifying malicious users that an email is in-use by a user.
        { message: 'Email has already been invited.' },
        (client) => client.userInvite.create({ data })
      )
  ) as Promise<UserInvite>
}

export const confirmUserInvite = async (code: string, email: string) => {
  validateRandomStr(code)
  validateEmail(email)

  const { confirmed, createdAt } = inviteWhere()

  const invite = await db.userInvite.findFirst({
    where: {
      code,
      confirmed,
      createdAt,
      email,
    },
  })

  validate(invite, {
    presence: { message: 'Invitation could not be validated.' },
  })

  return db.userInvite.update({
    data: { confirmed: true },
    where: { id: invite.id },
  })
}

export const inviteUser: MutationResolvers['inviteUser'] = async ({
  input: { email, name, roles = 'MEMBER' },
}) => {
  validateEmail(email)
  validateName(name)
  validateRoles(roles)

  const code = randomStr()
  const link = generateInviteLink(code, email, name, false)

  const inviter = context.currentUser.name
  const organizationId = context.currentUser.organizationId

  const res = await createInvite(email, {
    code,
    email,
    name,
    organizationId,
    roles,
  })

  await sendEmail('invite', email, { inviter, link, name })

  return res
}

export const signupUser: MutationResolvers['signupUser'] = async ({
  input: { email },
}) => {
  validateEmail(email)

  const code = randomStr()
  const link = generateInviteLink(code, email, undefined, true)

  const res = await createInvite(email, { code, email, roles: 'ADMIN' })

  await sendEmail('signup', email, { link })

  return res
}

export const resendInvite: MutationResolvers['resendInvite'] = async ({
  input: { email },
}) => {
  validateEmail(email)

  const { confirmed, createdAt } = inviteWhere()

  const invite = await db.userInvite.findFirst({
    where: {
      confirmed,
      createdAt,
      email,
    },
  })

  if (!invite) return false

  const link = generateInviteLink(
    invite.code,
    invite.email,
    invite.name,
    typeof invite.organizationId !== 'string'
  )

  await sendEmail('resend_invitation', invite.email, { link })

  return false
}
