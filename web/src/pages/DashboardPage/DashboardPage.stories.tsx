import type { Meta } from '@storybook/react'

import DashboardPage from './DashboardPage'

export default {
  title: 'Pages/Dashboard',
  component: DashboardPage,
} as Meta

export const generated = (args) => {
  return <DashboardPage {...args} />
}
