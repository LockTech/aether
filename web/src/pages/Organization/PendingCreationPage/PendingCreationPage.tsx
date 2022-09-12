import { Button, Stack, Text } from '@chakra-ui/react'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import Card from 'src/components/Card'

const PendingCreationPage = () => {
  const { currentUser, hasRole, logOut } = useAuth()

  if (typeof currentUser?.organizationId === 'string') {
    navigate(routes.dashboard())
    return null
  }

  if (hasRole(['ADMIN'])) {
    navigate(routes.createOrganization())
    return null
  }

  return (
    <>
      <MetaTags title="Pending Creation" />
      <Card>
        <Stack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            Pending Creation
          </Text>
          <Text>
            Contact your organization&apos;s administrator so they may login and
            finish setting up your organization.
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

export default PendingCreationPage
