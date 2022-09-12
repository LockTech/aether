import type { Meta, Story } from '@storybook/react'

import AuthLayout from 'src/layouts/AuthLayout'

import UnsubscribedPage from './UnsubscribedPage'

export default {
  title: 'Pages/Organization/Unsubscribed',
  component: UnsubscribedPage,
  decorators: [
    (Fn) => (
      <AuthLayout>
        <Fn />
      </AuthLayout>
    ),
  ],
} as Meta

export const Unsubscribed: Story = (args) => {
  return <UnsubscribedPage {...args} />
}
