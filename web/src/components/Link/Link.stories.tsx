import type { Meta, Story } from '@storybook/react'

import Link from './Link'
import type { LinkProps } from './Link'

export default {
  title: 'Components/Link',
  component: Link,
} as Meta

const template: Story<LinkProps> = (args) => <Link {...args} />

export const link: Story<LinkProps> = template.bind({})
link.args = {
  children: 'Click me!',
  color: 'blue.600',
  to: 'https://foo.bar',
}
