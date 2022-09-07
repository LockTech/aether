import * as React from 'react'

import ChakraProvider from '../src/components/ChakraProvider'

const withChakra = (StoryFn) => {
  return (
    <ChakraProvider>
      <StoryFn />
    </ChakraProvider>
  )
}

export const decorators = [withChakra]

export const parameters = {
  options: {
    storySort: {
      order: ['Pages', 'Layouts', 'Cells', 'Components'],
    },
  },
}
