import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { Box, Stack } from '@chakra-ui/react'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'

interface AuthLayoutProps {
  children?: ReactNode
  redirect?: boolean
}

const AuthLayout = ({ children, redirect }: AuthLayoutProps) => {
  const { isAuthenticated } = useAuth()

  useEffect(
    () => redirect && isAuthenticated && navigate(routes.dashboard()),
    [isAuthenticated, redirect]
  )

  return (
    <Box as={Stack} maxWidth="26rem" marginX="auto" paddingTop="4" spacing={8}>
      {children}
    </Box>
  )
}

export default AuthLayout
