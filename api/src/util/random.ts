import { randomInt } from 'crypto'

import { validate } from '@redwoodjs/api'

const DICTIONARY =
  'abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

/**
 * Generates a cryptographically secure (using {@link randomInt}), random string of characters.
 *
 * These characters will only container lower and uppercase latin-characters, and numerals 0-9.
 */
export const randomStr = (length = 64) => {
  let result = ''

  for (let i = 0; i < length; i++) {
    result += DICTIONARY.charAt(randomInt(DICTIONARY.length - 1))
  }

  return result
}

/**
 * Validates the given `val` was generated by the {@link randomStr} utility.
 *
 * In other-words, it contains lower and uppercase latin-characters, and numerals 0-9
 * and is of the given length, or the given override.
 */
export const validateRandomStr = (val: unknown, length = 64) =>
  validate(val, {
    format: { pattern: /^([a-zA-Z0-9])+$/, message: 'Unknown character.' },
    length: { equal: length, message: 'Unknown length.' },
    presence: { message: 'Expected to find a string of characters.' },
  })
