import gql from 'graphql-tag'

import { createValidatorDirective } from '@redwoodjs/graphql-server'

import { requireAuth as applicationRequireAuth } from 'src/lib/auth'

export const schema = gql`
  """
  Use to check whether or not a user is authenticated and is associated
  with an optional set of roles.
  """
  directive @requireAuth(
    """
    Whether or not a user has an organization.
    """
    organization: Boolean = true
    """
    Whether or not a user has the given role(s).
    """
    roles: [String]
    """
    Whether or not a user's subscription is active.
    """
    subscribed: Boolean = true
  ) on FIELD_DEFINITION
`

const validate = ({ directiveArgs }) => {
  const { organization, roles, subscribed } = directiveArgs
  applicationRequireAuth({ organization, roles, subscribed })
}

const requireAuth = createValidatorDirective(schema, validate)

export default requireAuth
