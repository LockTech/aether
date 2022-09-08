import { useCallback } from 'react'

import { Stack, Text, useToast } from '@chakra-ui/react'

import { useAuth } from '@redwoodjs/auth'
import { Form, PasswordField } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import Card from 'src/components/Card'
import { Field, Input, Label, Submit } from 'src/components/Forms'

export interface ResetPasswordPageProps {
  email: string
  resetToken: string
}

interface ResetPasswordFormData {
  email: string
  password: string
}

const ResetPasswordPage = ({ email, resetToken }: ResetPasswordPageProps) => {
  const { resetPassword } = useAuth()

  const toast = useToast()

  const onSubmit = useCallback(
    async ({ password }: ResetPasswordFormData) => {
      const toastId = toast({
        status: 'info',
        title: 'Resetting your password',
      })

      const res = await resetPassword({ password, resetToken })

      toast.close(toastId)

      if (res.error) {
        toast({
          status: 'error',
          title: 'Error reseting your password',
          description: res.error,
        })
        return
      }

      toast({
        status: 'success',
        title: "Your account's password has been reset",
      })
    },
    [resetPassword, resetToken, toast]
  )

  return (
    <>
      <MetaTags
        title="Password Reset"
        description="Reset your Aether account's password."
      />
      <Card>
        <Text fontSize="xl" fontWeight="bold" marginBottom="8">
          Password Reset
        </Text>
        <Form onSubmit={onSubmit}>
          <Stack spacing={6}>
            <Field name="email" readonly>
              <Label>Email Address</Label>
              <Input defaultValue={email} />
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
                  minLength: {
                    value: 8,
                    message: 'Your password must be greater than 8 characters.',
                  },
                  required: {
                    value: true,
                    message: 'A password is required.',
                  },
                }}
              />
            </Field>
            <Submit alignSelf="end">Reset</Submit>
          </Stack>
        </Form>
      </Card>
    </>
  )
}

export default ResetPasswordPage
