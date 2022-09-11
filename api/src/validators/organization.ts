import { validate } from '@redwoodjs/api'

export const validateName = (val: unknown) =>
  validate(val, {
    length: { message: 'Name is too long.', between: [0, 400] },
    presence: { message: 'A name is required.' },
  })
