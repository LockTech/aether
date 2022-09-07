import { theme as chakraTheme } from '@chakra-ui/react'
import type { Theme } from '@chakra-ui/react'

const theme: Theme = {
  ...chakraTheme,
  components: {
    ...chakraTheme.components,
    Button: {
      ...chakraTheme.components.Button,
      defaultProps: {
        colorScheme: 'teal',
        size: 'md',
        variant: 'solid',
      },
    },
  },
}

export default theme
