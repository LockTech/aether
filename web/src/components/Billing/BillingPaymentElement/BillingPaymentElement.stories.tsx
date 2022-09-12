import type { Meta, Story } from '@storybook/react'
import { Elements } from '@stripe/react-stripe-js'

import { stripe } from 'src/lib/stripe'

import BillingPaymentElement from './BillingPaymentElement'

export default {
  title: 'Components/Billing/Payment Element',
  component: BillingPaymentElement,
  decorators: [
    (Fn) => (
      <Elements stripe={stripe}>
        <Fn />
      </Elements>
    ),
  ],
} as Meta

const Template: Story = (args) => <BillingPaymentElement {...args} />

export const Default: Story = Template.bind({})
Default.storyName = 'Payment Element'
