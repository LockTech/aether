import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'

import { Stack, useToast } from '@chakra-ui/react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

import { routes } from '@redwoodjs/router'

import { Submit } from 'src/components/Forms'

const BillingPaymentElement = () => {
  const elements = useElements()
  const stripe = useStripe()

  const toast = useToast()

  const [loading, setLoading] = useState(true)

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      if (!elements || !stripe) return

      setLoading(true)
      const toastId = toast({
        status: 'info',
        title: 'Updating payment details',
      })

      const res = await stripe.confirmSetup({
        elements,
        redirect: 'always',
        confirmParams: {
          return_url: `${
            window.location.origin
          }${routes.organizationSetupBilling()}`,
        },
      })

      setLoading(false)
      toast.close(toastId)

      if (res.error) {
        toast({
          status: 'error',
          title: 'Error updating payment details',
          description: res.error.message,
        })
        return
      }

      toast({
        status: 'success',
        title: 'Successfully updated payment details',
      })
    },
    [elements, setLoading, stripe, toast]
  )

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={6}>
        <PaymentElement onReady={() => setLoading(false)} />
        <Submit alignSelf="end" disabled={!elements || !stripe || loading}>
          Save
        </Submit>
      </Stack>
    </form>
  )
}

export default BillingPaymentElement
