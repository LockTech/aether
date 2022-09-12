import { useEffect } from 'react'

import { Button, Stack, Text } from '@chakra-ui/react'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import BillingSetupSubscriptionCell from 'src/components/Billing/BillingSetupSubscriptionCell'
import Card from 'src/components/Card'

export interface SetupBillingPageProps {
  redirect_status?: 'succeeded'
  setup_intent?: string
  setup_intent_client_secret?: string
}

const SetupBillingPage = ({ redirect_status }: SetupBillingPageProps) => {
  const { currentUser } = useAuth()

  useEffect(() => {
    if (redirect_status !== 'succeeded') return

    const timer = setTimeout(() => window.location.reload(), 5000)
    return () => clearTimeout(timer)
  }, [redirect_status])

  if (!currentUser?.organizationId) {
    navigate(routes.createOrganization())
    return null
  }

  if (currentUser?.subscriptionActive) {
    navigate(routes.dashboard())
    return null
  }

  return (
    <>
      <MetaTags title="Setup Payment" />
      {typeof redirect_status === 'undefined' && (
        <Card>
          <Text fontSize="xl" fontWeight="bold" marginBottom="8">
            Setup Payment
          </Text>
          <BillingSetupSubscriptionCell />
        </Card>
      )}
      {redirect_status === 'succeeded' && (
        <Card>
          <Stack spacing={6}>
            <Stack spacing={2}>
              <Text fontSize="xl" fontWeight="bold">
                Payment Setup
              </Text>
              <Text color="GrayText" fontSize="sm">
                Your billing details have been saved and your subscription
                started. It may take a moment for these changes to take effect.
              </Text>
            </Stack>
            <Stack spacing={4}>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                variant="outline"
              >
                Refresh the page
              </Button>
              <Text color="GrayText" fontSize="sm">
                If you&apos;re not redirected in 5 seconds, manually refresh the
                page using the button above.
              </Text>
            </Stack>
          </Stack>
        </Card>
      )}
    </>
  )
}

export default SetupBillingPage
