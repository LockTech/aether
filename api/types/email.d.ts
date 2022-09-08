type InviteLocals = {
  inviter: string
  link: string
  name: string
}

type LinkLocals = {
  link: string
}

export type EmailLocals = {
  invite: InviteLocals
  resend_invitation: LinkLocals
  reset_password: LinkLocals
  signup: LinkLocals
}

export type EmailTemplates = keyof EmailLocals
