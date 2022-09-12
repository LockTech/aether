// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Private, Router, Route, Set } from '@redwoodjs/router'

import AuthLayout from 'src/layouts/AuthLayout'
import DashboardLayout from 'src/layouts/DashboardLayout'

const Routes = () => {
  return (
    <Router>
      <Route notfound page={NotFoundPage} />

      <Set wrap={[AuthLayout]} redirect>
        <Route path="/login" page={AuthLoginPage} name="authLogin" />
        <Route path="/signup" page={AuthSignupPage} name="authSignup" />
        <Route path="/confirm" page={AuthConfirmPage} name="authConfirm" />
        <Route path="/forgot-password" page={AuthForgotPasswordPage} name="authForgotPassword" />
        <Route path="/reset-password" page={AuthResetPasswordPage} name="authResetPassword" />
      </Set>

      <Set wrap={[AuthLayout]}>
        <Private unauthenticated="authLogin" roles={['ADMIN']}>
          <Route path="/organization/create" page={OrganizationCreatePage} name="createOrganization" />
          <Route path="/organization/setup-billing" page={OrganizationSetupBillingPage} name="organizationSetupBilling" />
        </Private>

        <Private unauthenticated="authLogin">
          <Route path="/organization/pending-creation" page={OrganizationPendingCreationPage} name="organizationPendingCreation" />
          <Route path="/organization/unsubscribed" page={OrganizationUnsubscribedPage} name="organizationUnsubscribed" />
        </Private>
      </Set>

      <Private unauthenticated="authLogin" wrap={[DashboardLayout]}>
        <Route path="/dashboard" page={DashboardPage} name="dashboard" />
      </Private>
    </Router>
  )
}

export default Routes
