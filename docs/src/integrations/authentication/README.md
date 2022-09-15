# Authentication

Aether is setup to use [RedwoodJS' dbAuth](https://redwoodjs.com/docs/auth/dbauth).

## Sign up

Signing up for an account with an Aether application should be done by a member of an organization (a.k.a. team, group, community, ...) who should have elevated access over the organization's resources — an administrator.

After creating their account, the administrator will be required to provide information about the organization: creating a [Stripe customer](https://stripe.com/docs/billing/customer) as well as the user's organization. After being created, payment information [will be collected](https://stripe.com/docs/payments/payment-intents) from the admin — used to charge the organization for their subscription to the application.

## Account Confirmation

Out of the box, Aether supports confirmation by-way of sending an email to the provided address at the time of signup or invitation. The email will contain a unique code: used by the application to assert the message was opened by the addresses' owner.

## Password Reset

When a user attempts to reset their account's password, a message will be sent to their account's email containing a unique token used to assert the addresses' owner responded to the reset.

## Inviting Members

The APIs are in place to allow an administrator to to invite other members of their organization to the application — reusing the same flow which allowed for the administrator to signup originally.
