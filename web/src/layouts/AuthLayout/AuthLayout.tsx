import type { ReactNode } from 'react'

import { Box, Stack } from '@chakra-ui/react'

interface AuthLayoutProps {
  children?: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box as={Stack} maxWidth="26rem" marginX="auto" paddingTop="4" spacing={8}>
      {children}
    </Box>
  )
}

export default AuthLayout
