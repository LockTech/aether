type InviteLocals = {
  inviter: string
  link: string
  name: string
}

type SignupLocals = {
  link: string
}

export type EmailLocals = {
  invite: InviteLocals
  signup: SignupLocals
}

export type EmailTemplates = keyof EmailLocals
