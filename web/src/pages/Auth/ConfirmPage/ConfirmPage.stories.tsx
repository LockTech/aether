import { faker } from '@faker-js/faker'
import type { Meta, Story } from '@storybook/react'

import AuthLayout from 'src/layouts/AuthLayout'

import ConfirmPage from './ConfirmPage'
import type { ConfirmPageProps } from './ConfirmPage'

export default {
  title: 'Pages/Auth/Confirm',
  component: ConfirmPage,
  decorators: [
    (Fn) => (
      <AuthLayout>
        <Fn />
      </AuthLayout>
    ),
  ],
} as Meta

const template: Story<ConfirmPageProps> = (args) => <ConfirmPage {...args} />

export const invite: Story<ConfirmPageProps> = template.bind({})
invite.args = {
  code: faker.datatype.string(64),
  email: faker.internet.email(),
  name: faker.name.fullName(),
}

export const signup: Story<ConfirmPageProps> = template.bind({})
signup.args = {
  code: faker.datatype.string(64),
  email: faker.internet.email(),
  signup: true,
}
