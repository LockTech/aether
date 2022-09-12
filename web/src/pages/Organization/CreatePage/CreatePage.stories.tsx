import type { Meta, Story } from '@storybook/react'

import AuthLayout from 'src/layouts/AuthLayout'

import CreatePage from './CreatePage'

export default {
  title: 'Pages/Organization/Create',
  component: CreatePage,
  decorators: [
    (Fn) => (
      <AuthLayout>
        <Fn />
      </AuthLayout>
    ),
  ],
} as Meta

export const Create: Story = (args) => {
  return <CreatePage {...args} />
}
