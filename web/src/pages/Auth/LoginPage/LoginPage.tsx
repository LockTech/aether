import { useCallback } from 'react'

import { Box, Stack, Text, useToast } from '@chakra-ui/react'

import { useAuth } from '@redwoodjs/auth'
import { Form, EmailField, PasswordField } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import Card from 'src/components/Card'
import { Field, Input, Label, Submit } from 'src/components/Forms'
import Link, { routes } from 'src/components/Link'

interface LoginFormData {
  email: string
  password: string
}

const LoginPage = () => {
  const { logIn } = useAuth()

  const toast = useToast()

  const onSubmit = useCallback(
    async ({ email, password }: LoginFormData) => {
      const toastId = toast({
        status: 'info',
        title: 'Logging in to your account',
      })

      const res = await logIn({ password, username: email })

      toast.close(toastId)

      if (res.error) {
        toast({
          status: 'error',
          title: 'Error logging in',
          description: res.error,
        })
        return
      }

      toast({ status: 'success', title: 'Successfully logged in' })
    },
    [logIn, toast]
  )

  return (
    <>
      <MetaTags
        title="Login"
        description="Login to an existing Aether account."
      />
      <Card>
        <Text fontSize="xl" fontWeight="bold" marginBottom="8">
          Login
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
            <Field name="password">
              <Label>Password</Label>
              <Input
                as={PasswordField}
                placeholder="••••••••••••••"
                validation={{
                  maxLength: {
                    value: 400,
                    message: 'Your password is too long.',
                  },
                  required: {
                    value: true,
                    message: 'A password is required.',
                  },
                }}
              />
            </Field>
            <Link
              alignSelf="end"
              fontSize="sm"
              to={routes.authForgotPassword()}
            >
              Forget your password?
            </Link>
            <Submit alignSelf="end">Login</Submit>
          </Stack>
        </Form>
      </Card>
      <Box
        as={Stack}
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={4}
        spacing={2}
      >
        <p>Need to create an account?</p>
        <Link to={routes.authSignup()}>Signup</Link>
      </Box>
    </>
  )
}

export default LoginPage
