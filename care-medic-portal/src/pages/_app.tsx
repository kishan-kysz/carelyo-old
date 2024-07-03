import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createStore, StateMachineProvider } from 'little-state-machine'
import type { ReactElement, ReactNode } from 'react'
import { NotificationContextProvider } from '@components/core/notifcation-context'
import { Poppins } from 'next/font/google'
import { SessionProvider } from '@hooks/use-session'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { RouterTransition } from '@components/layout/router-transition'
import './consultation/styles.css'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '700'] })

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
    },
    mutations: {
      // Global query invalidation ->  this will refetch all queries with type: 'active' when a mutation is successful URL: https://react-query.tanstack.com/guides/query-invalidation
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          refetchType: 'active',
          type: 'active',
          stale: true,
        }) /* predicate: (query) => query.queryKey[0] !== 'profile' }*/
      },
    },
  },
})

export const stateArr = [
  'IDLE',
  'CREATING',
  'PREJOIN',
  'JOINING',
  'LEAVING',
  'CREATING',
]
createStore({
  // @ts-ignore
  state: 'IDLE',
  consultation: {},
  video: {},
  showAlert: false,
  preJoin: 2,
  maxDuration: 15,
  sbar: {
    situation: '',
    background: '',
    assessment: '',
    diagnosis: '',
    notes: '',
    recommendation: '',
  },
})

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        theme={{
          fontFamily: 'Poppins, sans-serif',
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
              '#265C4B',
            ],
          },
          primaryColor: 'brand',
        }}
      >
        <RouterTransition />
        <StateMachineProvider>
          <Notifications
            position="top-right"
            zIndex={10_000_000}
            limit={4}
            autoClose={10_000}
          />
          <NotificationContextProvider>
            <div className={poppins.className}>
              <SessionProvider>
                {getLayout(<Component {...pageProps} />)}
              </SessionProvider>
            </div>
          </NotificationContextProvider>
        </StateMachineProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default MyApp
