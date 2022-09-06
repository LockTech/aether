export const schema = gql`
  enum UserRole {
    ADMIN
    MEMBER
  }

  type User {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`
