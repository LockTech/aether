import { Button, Stack, Text } from '@chakra-ui/react'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import Card from 'src/components/Card'

const UnsubscribedPage = () => {
  const { currentUser, hasRole, logOut } = useAuth()

  if (currentUser?.subscriptionActive) {
    navigate(routes.dashboard())
    return null
  }

  if (hasRole('ADMIN')) {
    navigate(routes.organizationSetupBilling())
    return null
  }

  return (
    <>
      <MetaTags title="Subscription Lapsed" />
      <Card>
        <Stack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            Unsubscribed
          </Text>
          <Text>
            Contact your organization&apos;s administrator to renew your
            subscription.
          </Text>
        </Stack>
      </Card>
      <Stack flexDir="column" alignItems="center" spacing={3}>
        <Text fontSize="sm">Are you your organization&apos;s admin?</Text>
        <Button
          onClick={() => logOut()}
          size="sm"
          variant="link"
          w="fit-content"
        >
          Finish setting up your organization
        </Button>
      </Stack>
    </>
  )
}

export default UnsubscribedPage
