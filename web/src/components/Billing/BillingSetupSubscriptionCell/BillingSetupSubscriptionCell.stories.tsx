import { Text } from '@chakra-ui/react'
import type { Meta } from '@storybook/react'

import Card from 'src/components/Card'
import AuthLayout from 'src/layouts/AuthLayout'

import { Loading, Failure, Success } from './BillingSetupSubscriptionCell'
import { standard } from './BillingSetupSubscriptionCell.mock'

export default {
  title: 'Cells/Billing/Setup Subscription',
  decorators: [
    (Fn) => (
      <AuthLayout>
        <Card>
          <Text fontSize="xl" fontWeight="bold" marginBottom="8">
            Setup Billing
          </Text>
          <Fn />
        </Card>
      </AuthLayout>
    ),
  ],
} as Meta

export const loading = (args) => {
  return <Loading {...args} />
}

export const failure = (args) => {
  return <Failure error={new Error('Oh no')} {...args} />
}

export const success = (args) => {
  return <Success {...standard()} {...args} />
}
