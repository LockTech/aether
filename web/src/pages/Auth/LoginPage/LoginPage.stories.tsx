import type { Meta, Story } from '@storybook/react'

import AuthLayout from 'src/layouts/AuthLayout'

import LoginPage from './LoginPage'

export default {
  title: 'Pages/Auth/Login',
  component: LoginPage,
  decorators: [
    (Fn) => (
      <AuthLayout>
        <Fn />
      </AuthLayout>
    ),
  ],
} as Meta

export const Login: Story = (args) => {
  return <LoginPage {...args} />
}
