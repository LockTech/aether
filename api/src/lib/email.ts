import { resolve } from 'path'

import Email from 'email-templates'
import { createTransport } from 'nodemailer'
import type { EmailLocals, EmailTemplates } from 'types/email'

import { logger } from 'src/lib/logger'

const transport = createTransport({
  // @ts-expect-error RedwoodJS' logger is bunyan-compatible
  logger,
  host: process.env.EMAIL_SMTP_HOST,
  port: parseInt(process.env.EMAIL_SMTP_PORT),
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
})

const client = new Email({
  transport,
  juiceResources: {
    webResources: {
      images: true,
      relativeTo: resolve(__dirname, '../templates/assets'),
    },
  },
})

export const sendEmail = async <T extends EmailTemplates>(
  template: T,
  to: string | string[],
  locals: EmailLocals[T]
) => {
  await client.send({
    locals,
    message: { from: process.env.EMAIL_FROM, to },
    template: resolve(__dirname, '../templates', template),
  })
}
