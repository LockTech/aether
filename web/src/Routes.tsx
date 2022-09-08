// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'

import AuthLayout from 'src/layouts/AuthLayout'

const Routes = () => {
  return (
    <Router>
      <Route notfound page={NotFoundPage} />

      <Set wrap={[AuthLayout]}>
        <Route path="/login" page={AuthLoginPage} name="authLogin" />
        <Route path="/signup" page={AuthSignupPage} name="authSignup" />
        <Route path="/confirm" page={AuthConfirmPage} name="authConfirm" />
        <Route path="/forgot-password" page={AuthForgotPasswordPage} name="authForgotPassword" />
        <Route path="/reset-password" page={AuthResetPasswordPage} name="authResetPassword" />
      </Set>
    </Router>
  )
}

export default Routes
