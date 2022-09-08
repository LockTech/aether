import { useCallback, useState } from 'react'

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Stack,
  Text,
} from '@chakra-ui/react'

import { Form, EmailField } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import Card from 'src/components/Card'
import { Field, Input, Label, Submit } from 'src/components/Forms'
import Link, { routes } from 'src/components/Link'
import useToastMutation from 'src/hooks/useToastMutation'

interface SignupFormData {
  email: string
}

const SIGNUP = gql`
  mutation Signup($input: SignupInput!) {
    signupUser(input: $input) {
      id
    }
  }
`

const RESEND = gql`
  mutation ResendSignupInvitation($input: ResendInviteInput!) {
    resendInvite(input: $input)
  }
`

const SignupPage = () => {
  const [signupSuccessful, setSignupSuccessful] = useState(false)
  const [signup] = useToastMutation(SIGNUP)
  const onSubmit = useCallback(
    ({ email }: SignupFormData) =>
      signup(
        { input: { email } },
        {
          loading: { title: 'Signing up for an account' },
          success: () => {
            setSignupSuccessful(true)
            return {
              title: 'Signup successful',
              description:
                'A confirmation message has been sent to your email.',
            }
          },
        }
      ),
    [signup]
  )

  const [resend, { loading: resendLoading }] = useToastMutation(RESEND)
  const onResend = useCallback(
    () =>
      resend(
        {},
        {
          loading: { title: 'Resending signup invitation' },
          success: { title: 'Signup invitation has been resent' },
        }
      ),
    [resend]
  )

  return (
    <>
      <MetaTags
        title="Signup"
        description="Signup for an account with the Aether application."
      />
      {signupSuccessful && (
        <Alert borderRadius="md" status="success">
          <Stack alignItems="start">
            <AlertTitle>Signup successful!</AlertTitle>
            <AlertDescription>
              Your account has been signed up and a confirmation message sent to
              your email.
            </AlertDescription>
            <Button
              alignSelf="end"
              colorScheme="green"
              disabled={resendLoading}
              onClick={onResend}
              size="sm"
            >
              Resend
            </Button>
          </Stack>
        </Alert>
      )}
      <Card>
        <Text fontSize="xl" fontWeight="bold" marginBottom="8">
          Signup
        </Text>
        <Form onSubmit={onSubmit}>
          <Stack spacing={6}>
            <Field name="email">
              <Label>Email Address</Label>
              <Input
                as={EmailField}
                placeholder="Email address"
                validation={{
                  pattern: {
                    value: /^[^@\s]+@[^.\s]+\.[^\s]+$/,
                    message: "Your email address isn't formatted correctly.",
                  },
                  maxLength: {
                    value: 320,
                    message: 'Your email address is too long.',
                  },
                  required: {
                    value: true,
                    message: 'An email address is required.',
                  },
                }}
              />
            </Field>
            <Submit alignSelf="end" disabled={signupSuccessful}>
              Signup
            </Submit>
          </Stack>
        </Form>
      </Card>
      <Box
        as={Stack}
        display="flex"
        flexDirection="column"
        alignItems="center"
        spacing={2}
      >
        <p>Already have an account?</p>
        <Link to={routes.authSignup()}>Login</Link>
      </Box>
    </>
  )
}

export default SignupPage
