import { AuthProvider } from '@redwoodjs/auth'
import { RedwoodProvider } from '@redwoodjs/web'
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo'

import Provider from 'src/components/Provider'
import Sentry from 'src/lib/sentry'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import './index.css'

const App = () => (
  <Sentry.ErrorBoundary fallback={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider type="dbAuth">
        <Provider>
          <RedwoodApolloProvider>
            <Routes />
          </RedwoodApolloProvider>
        </Provider>
      </AuthProvider>
    </RedwoodProvider>
  </Sentry.ErrorBoundary>
)

export default App
