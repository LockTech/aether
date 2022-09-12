import { useCallback } from 'react'

import { Stack, Text } from '@chakra-ui/react'

import { useAuth } from '@redwoodjs/auth'
import { EmailField, Form } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import Card from 'src/components/Card'
import { Field, Input, Label, Submit } from 'src/components/Forms'
import useToastMutation from 'src/hooks/useToastMutation'

const MUTATION = gql`
  mutation OrganizationCreate($input: OrganizationInput!) {
    createOrganization(input: $input) {
      id
    }
  }
`

const CreatePage = () => {
  const { currentUser, reauthenticate } = useAuth()

  const [mutate] = useToastMutation(MUTATION)

  const onSubmit = useCallback(
    (input) =>
      mutate(
        { input },
        {
          loading: { title: 'Creating your organization.' },
          success: () => {
            reauthenticate()

            navigate(routes.organizationSetupBilling())

            return { title: 'Organization created' }
          },
        }
      ),
    [mutate, reauthenticate]
  )

  if (typeof currentUser?.organizationId === 'string') {
    navigate(routes.dashboard())
    return null
  }

  return (
    <>
      <MetaTags
        title="Create your Organization"
        description="Provide contact information about your organization."
      />
      <Card>
        <Text fontSize="xl" fontWeight="bold" marginBottom="8">
          Create your Organization
        </Text>
        <Form onSubmit={onSubmit}>
          <Stack spacing={6}>
            <Field name="name">
              <Label>Name</Label>
              <Input
                placeholder="Example Inc."
                validation={{
                  maxLength: {
                    message: 'Name is too long.',
                    value: 150,
                  },
                  required: {
                    message: "Your organization's name is required.",
                    value: true,
                  },
                }}
              />
            </Field>
            <Field name="email">
              <Label>Billing Email Address</Label>
              <Input
                as={EmailField}
                placeholder="billing@example.com"
                validation={{
                  maxLength: {
                    message: 'Email address is too long.',
                    value: 320,
                  },
                  pattern: {
                    message: 'Email address is not formatted correctly.',
                    value: /^[^@\s]+@[^.\s]+\.[^\s]+$/,
                  },
                  required: {
                    message: 'An email address is requried.',
                    value: true,
                  },
                }}
              />
            </Field>
            <Submit alignSelf="end">Create</Submit>
          </Stack>
        </Form>
      </Card>
    </>
  )
}

export default CreatePage
