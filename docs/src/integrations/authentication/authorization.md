# Authorization

Aether makes use of [RedwoodJS' `@requireAuth` directive](https://redwoodjs.com/docs/directives#requireauth) to facilitate authorizing access to an application's [services](https://redwoodjs.com/docs/services). The directive expects three arguments, with two having defaults values which a majority of implementations are expected to make use of.

| Name           | Description                                                          | Default |
|----------------|----------------------------------------------------------------------|---------|
| `organization` | Assert the user either does or does not have an organization.        | `true`  |
| `roles`        | Check whether or not a user has the given role(s).                   | -       |
| `subscribed`   | Assert the user either does or does not have an active subscription. | `true`  |
