import { UserRole } from '@prisma/client'

import { validate } from '@redwoodjs/api'

export const validateEmail = (val: unknown) =>
  validate(val, {
    email: { message: 'Email address is not formatted correctly.' },
    length: { message: 'Email address is too long.', between: [0, 320] },
    presence: { message: `An email address is required.` },
  })

export const validateName = (val: unknown) =>
  validate(val, {
    length: { message: 'Name is too long.', between: [0, 400] },
    presence: { message: 'A name is required.' },
  })

export const validateRoles = (val: unknown) =>
  validate(val, {
    presence: { message: 'A role is required.' },
    inclusion: {
      message: 'Recieved an invalid role.',
      in: Object.keys(UserRole),
    },
  })
