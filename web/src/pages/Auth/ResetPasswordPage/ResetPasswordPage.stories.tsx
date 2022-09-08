import { faker } from '@faker-js/faker'
import type { Meta, Story } from '@storybook/react'

import AuthLayout from 'src/layouts/AuthLayout'

import ResetPasswordPage from './ResetPasswordPage'
import type { ResetPasswordPageProps } from './ResetPasswordPage'

export default {
  title: 'Pages/Auth/Reset Password',
  component: ResetPasswordPage,
  decorators: [
    (Fn) => (
      <AuthLayout>
        <Fn />
      </AuthLayout>
    ),
  ],
} as Meta

export const ResetPassword: Story<ResetPasswordPageProps> = (args) => {
  return <ResetPasswordPage {...args} />
}
ResetPassword.args = {
  email: faker.internet.email(),
}
