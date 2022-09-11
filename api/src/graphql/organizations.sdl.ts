export const schema = gql`
  type Organization {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!

    email: String!
    name: String!

    users: [User!]!
    userInvites: [UserInvite!]!
  }

  input OrganizationInput {
    email: String!
    name: String!
  }

  type Mutation {
    createOrganization(input: OrganizationInput!): Organization!
      @requireAuth(organization: false, roles: ["ADMIN"])
    deleteOrganization: Organization! @requireAuth(roles: ["ADMIN"])
  }
`
