import type { Meta, Story } from '@storybook/react'

import AuthLayout from 'src/layouts/AuthLayout'

import ForgotPasswordPage from './ForgotPasswordPage'

export default {
  title: 'Pages/Auth/Forgot Password',
  component: ForgotPasswordPage,
  decorators: [
    (Fn) => (
      <AuthLayout>
        <Fn />
      </AuthLayout>
    ),
  ],
} as Meta

export const ForgotPassword: Story = (args) => {
  return <ForgotPasswordPage {...args} />
}
