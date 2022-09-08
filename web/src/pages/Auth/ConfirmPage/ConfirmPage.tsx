import { useCallback } from 'react'

import { Stack, Text, useToast } from '@chakra-ui/react'

import { useAuth } from '@redwoodjs/auth'
import { Form, PasswordField } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'

import Card from 'src/components/Card'
import { Field, Input, Label, Submit } from 'src/components/Forms'

interface ConfirmFormData {
  email: string
  name: string
  password: string
}

export interface ConfirmPageProps {
  code: string
  email: string
  name?: string
  signup?: boolean
}

const ConfirmPage = ({
  code,
  email,
  name,
  signup: isSignup,
}: ConfirmPageProps) => {
  const { signUp } = useAuth()

  const toast = useToast()

  const onSubmit = useCallback(
    async (d: ConfirmFormData) => {
      const toastId = toast({
        status: 'info',
        description: 'Confirming your account.',
      })

      const res = await signUp({
        ...d,
        code,
        name: d.name,
        password: d.password,
        username: d.email,
      })

      toast.close(toastId)

      if (res.error) {
        toast({
          status: 'error',
          title: 'Error creating your account',
          description: res.error,
        })
        return
      }

      toast({
        status: 'success',
        title: 'Account Created',
        description:
          'Your account has been successfully confirmed and created.',
      })
    },
    [code, signUp, toast]
  )

  return (
    <>
      <MetaTags
        title="Account Confirmation"
        description="Confirm and create your Aether account."
      />
      <Card>
        <Text fontSize="xl" fontWeight="bold" marginBottom="8">
          {isSignup ? 'Signup' : 'Invite'} Confirmation
        </Text>
        <Form onSubmit={onSubmit}>
          <Stack spacing={6}>
            <Field name="email" readonly>
              <Label>Email Address</Label>
              <Input defaultValue={email} />
            </Field>
            <Field name="name" readonly={typeof name === 'string'}>
              <Label>Full Name</Label>
              <Input
                defaultValue={name}
                placeholder="Jane Doe"
                validation={{
                  maxLength: {
                    value: 400,
                    message: 'Your name is too long.',
                  },
                  required: {
                    value: true,
                    message: 'A name is required.',
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
            <Submit alignSelf="end">Confirm</Submit>
          </Stack>
        </Form>
      </Card>
    </>
  )
}

export default ConfirmPage
