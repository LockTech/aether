import { validate as isUUID } from 'uuid'

import { RedwoodGraphQLError } from '@redwoodjs/graphql-server'

/**
 * Validates the given `val` is a [v4 UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)), throwing a {@link RedwoodGraphQLError} with `message` if it is not.
 */
export const validateUUID = (val: string, message: string) => {
  if (!isUUID(val)) throw new RedwoodGraphQLError(message)
}
