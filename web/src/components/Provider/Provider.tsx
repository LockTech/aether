import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import type { ChakraProviderProps } from '@chakra-ui/react'

import theme from 'src/theme'

const Provider = (p: ChakraProviderProps) => {
  return (
    <>
      <ColorModeScript />
      <ChakraProvider theme={theme} {...p} />
    </>
  )
}

export default Provider
