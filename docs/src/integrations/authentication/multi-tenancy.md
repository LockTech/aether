# Multi-tenancy

Aether has been designed with a [multi-tenant (a.k.a Team) architecture](https://en.wikipedia.org/wiki/Multitenancy) in mind. For this boilerplate, this means each user is expected to belong to one (and only one) `organization`.

## Current Organization

From within your application's [services](https://redwoodjs.com/docs/services) you will have access to the `id` of the organization belonging to the current user via the `currentUser.organizationId` property, found on the [API context](https://redwoodjs.com/docs/graphql#context). As expected, this property will only be available from within services which require authentication.

## Model Patterns

Prisma patterns which help to facilitate a multi-tenant architecture.

### Uniqueness

When retrieving records from your database, you'll likely only want to [find unique models](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique) based on some provided information — as well as the organization which the `currentUser` belongs to. To facilitate this, it's recommended you define [a compound unique constraint](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#unique-1) which includes the provided information as well as the field used to store the organization's `id`.

### Cascading Deletion

When an organization is deleted, it'll likely be desirable to delete all of the organization's related-records. This can be achieved by configuring [a cascading delete](https://www.prisma.io/docs/guides/database/advanced-database-tasks/cascading-deletes) when defining the foreign key relationship between the organization model and others.

### Putting It Together

When combined, the uniqueness and cascading deletion topics described above should result in an implementation which resembles the following.

```prisma
model Organization {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  somethings Something[]
}

model Something {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  organizationId String

  @@unique([id, organizationId], name: "tenant")
}
```
