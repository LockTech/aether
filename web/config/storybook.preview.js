import * as React from 'react'

import Provider from '../src/components/Provider'

const withProvider = (StoryFn) => {
  return (
    <Provider>
      <StoryFn />
    </Provider>
  )
}

export const decorators = [withProvider]

export const parameters = {
  options: {
    storySort: {
      order: ['Pages', 'Layouts', 'Cells', 'Components'],
    },
  },
}
