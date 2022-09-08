export const schema = gql`
  type UserInvite {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    confirmed: Boolean!
    email: String!
    name: String
    roles: UserRole!

    organization: Organization @requireAuth(roles: "ADMIN")
    organizationId: String @requireAuth(roles: "ADMIN")

    inviter: User @requireAuth(roles: "ADMIN")
    inviterId: String @requireAuth(roles: "ADMIN")
  }

  input InviteInput {
    email: String!
    name: String!
    roles: UserRole
  }

  input SignupInput {
    email: String!
  }

  input ResendInviteInput {
    email: String!
  }

  type Mutation {
    inviteUser(input: InviteInput!): UserInvite! @requireAuth(roles: "ADMIN")
    signupUser(input: SignupInput!): UserInvite! @skipAuth
    resendInvite(input: ResendInviteInput!): Boolean @skipAuth
  }
`
