import { Loader, MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import NavRoutes from './components/Routes'
import { GoogleOAuthProvider } from '@react-oauth/google'

import './utils/i18n'
import { GOOGLE_CLIENT_ID } from './utils/routes'
const container = document.getElementById('root')
const root = createRoot(container as HTMLDivElement)
const queryClient = new QueryClient()
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <MantineProvider
            withNormalizeCSS={true}
            withGlobalStyles={true}
            theme={{
              colors: {
                brand: [
                  '#80BFAB',
                  '#64BEA2',
                  '#45C39C',
                  '#2BC495',
                  '#16C48E',
                  '#00C689',
                  '#12A074',
                  '#1D8464',
                  '#236D56',
                  '#265C4B'
                ]
              },
              fontFamily: 'Poppins, sans-serif',
              primaryColor: 'brand'
            }}
          >
            <NotificationsProvider position='top-left' limit={3}>
              <Suspense fallback={<Loader />}>
                <NavRoutes />
              </Suspense>
            </NotificationsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
