export const schema = gql`
  type Billing {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SetupIntent {
    client_secret: String!
  }

  type Query {
    createSetupIntent: SetupIntent!
      @requireAuth(roles: ["ADMIN"], subscribed: false)
  }
`
