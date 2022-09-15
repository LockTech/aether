# Sending Emails

Aether makes use of the [`email-templates`](https://github.com/forwardemail/email-templates) package to send emails, rendering them using [pug](https://pugjs.org/api/getting-started.html).

## Sending In Development

When developing your application, [emails will **not** be sent](https://github.com/forwardemail/email-templates#preview) to the provided address. Instead, they will be opened in your default browser — alleviating the need to purchase or signup for a subscription in the early stages of product-development.

## Typing Template Locals

The `api/types/email.d.ts` file allows you to define the shape of your template's `local` — the object which gets passed to the template.

> See `api/src/lib/email.ts` to see how these types are put to use.
