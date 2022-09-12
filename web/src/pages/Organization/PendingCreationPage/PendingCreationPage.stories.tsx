import type { Meta, Story } from '@storybook/react'

import AuthLayout from 'src/layouts/AuthLayout'

import PendingCreationPage from './PendingCreationPage'

export default {
  title: 'Pages/Organization/Pending Creation',
  component: PendingCreationPage,
  decorators: [
    (Fn) => (
      <AuthLayout>
        <Fn />
      </AuthLayout>
    ),
  ],
} as Meta

export const PendingCreation: Story = (args) => {
  return <PendingCreationPage {...args} />
}
