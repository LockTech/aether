import type { Meta, Story } from '@storybook/react'

import AuthLayout from 'src/layouts/AuthLayout'

import SignupPage from './SignupPage'

export default {
  title: 'Pages/Auth/Signup',
  component: SignupPage,
  decorators: [
    (Fn) => (
      <AuthLayout>
        <Fn />
      </AuthLayout>
    ),
  ],
} as Meta

export const Signup: Story = (args) => {
  return <SignupPage {...args} />
}
