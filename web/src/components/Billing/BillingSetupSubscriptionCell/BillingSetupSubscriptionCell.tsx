import { useConst, Spinner, Stack, useToast } from '@chakra-ui/react'
import { Elements } from '@stripe/react-stripe-js'
import { BillingSetupSubscription } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import BillingPaymentElement from 'src/components/Billing/BillingPaymentElement'
import { stripe as globalStripe } from 'src/lib/stripe'

export const QUERY = gql`
  query BillingSetupSubscription {
    intent: createSetupIntent {
      client_secret
    }
  }
`

export const Loading = () => {
  return (
    <Stack alignItems="center">
      <Spinner color="teal.500" size="lg" speed="0.7s" />
    </Stack>
  )
}

export const Failure = (p: CellFailureProps) => {
  const toast = useToast()

  useConst(() =>
    toast({
      status: 'error',
      title: 'Error setting up billing',
      description: p.error?.message,
    })
  )

  return null
}

export const Success = ({
  intent,
}: CellSuccessProps<BillingSetupSubscription>) => {
  return (
    <Elements
      stripe={globalStripe}
      options={{ clientSecret: intent.client_secret }}
    >
      <BillingPaymentElement />
    </Elements>
  )
}
