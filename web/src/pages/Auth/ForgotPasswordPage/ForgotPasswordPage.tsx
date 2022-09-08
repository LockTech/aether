import { useCallback } from 'react'

import { Stack, Text, useToast } from '@chakra-ui/react'

import { useAuth } from '@redwoodjs/auth'
import { EmailField, Form } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import Card from 'src/components/Card'
import { Field, Input, Label, Submit } from 'src/components/Forms'
import Link, { routes } from 'src/components/Link'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth()

  const toast = useToast()

  const onSubmit = useCallback(
    async ({ email }: ForgotPasswordFormData) => {
      const toastId = toast({ status: 'info', title: 'Sending password reset' })

      const res = await forgotPassword(email)

      toast.close(toastId)

      if (res.error) {
        toast({
          status: 'error',
          title: 'Error sending password reset',
          description: res.error,
        })
        return
      }

      toast({
        status: 'success',
        title: 'Password reset sent',
        description:
          "Check your account's email for a link to reset its password.",
      })
    },
    [forgotPassword, toast]
  )

  return (
    <>
      <MetaTags
        title="Password Reset Request"
        description="Request a password reset email be sent to your Aether account's email address."
      />
      <Card>
        <Text fontSize="xl" fontWeight="bold" marginBottom="8">
          Forget your password?
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
            <Submit alignSelf="end">Send Reset</Submit>
          </Stack>
        </Form>
      </Card>
      <Link alignSelf="center" to={routes.authLogin()}>
        Back to Login
      </Link>
    </>
  )
}

export default ForgotPasswordPage
