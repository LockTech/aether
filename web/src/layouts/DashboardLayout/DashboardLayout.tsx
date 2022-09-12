import type { ReactNode } from 'react'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'

interface DashboardLayoutProps {
  children?: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { currentUser, loading } = useAuth()

  if (!currentUser || loading) return null

  if (!currentUser.organizationId) {
    navigate(routes.organizationPendingCreation())
    return null
  }

  if (!currentUser.subscriptionActive) {
    navigate(routes.organizationUnsubscribed())
    return null
  }

  return <>{children}</>
}

export default DashboardLayout
