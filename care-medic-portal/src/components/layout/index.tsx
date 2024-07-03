import { ReactNode, Suspense, useEffect, useState } from 'react'

import useProfile from '@hooks/use-profile'
import { AppShell, Box, LoadingOverlay } from '@mantine/core'
import useNotification, { INotification } from '@hooks/use-notifications'
import Head from 'next/head'
import ProfileFormUpdate from '../profile/form/complete-profile'
import SuspenseLoader from '../core/suspense-loader'
import { DEMO_NOTIFICATION } from '@utils/env'
import { useMediaQuery } from '@mantine/hooks'
import { NotSupported } from '../core/not-supported'
import { NavbarSearch } from './navbar'
import PageHeader from './header'
import { useRouter } from 'next/router'

const DEMO: INotification[] = [
  { id: 1, message: 'This is a demo notification 1', type: 'info' },
  { id: 2, message: 'This is a demo notification 2', type: 'error' },
  { id: 3, message: 'This is a demo notification 3', type: 'success' },
  { id: 4, message: 'This is a demo notification 4', type: 'info' },
  { id: 5, message: 'This is a demo notification 5', type: 'error' },
]
const handleAddDemoNotification = (
  demo: INotification[],
  addNotication: (notfication: INotification, duration?: number) => void,
) => {
  const notifacations = [...demo]
  const interval = setInterval(() => {
    if (notifacations.length > 0) {
      const notification = notifacations.shift()
      addNotication(notification, 5000)
    } else {
      clearInterval(interval)
    }
  }, 5000)
}

type LayoutProps = {
  children: ReactNode
  title: string
  action?: () => void
  actionLabel?: string
}

function Layout({ children, title, action, actionLabel }: LayoutProps) {
  const { user, isLoading } = useProfile()
  const [currentMsg, setCurrentMsg] = useState<INotification>(null)
  const { notifications, removeNotification, addNotification } =
    useNotification()
  const router = useRouter()

  const showSideBar =
    user?.activeConsultation !== null &&
    router.pathname !== '/consultation/[id]'
  useEffect(() => {
    if (notifications.length > 0) {
      setCurrentMsg(notifications[0])
    } else {
      setCurrentMsg(null)
    }
    if (DEMO_NOTIFICATION && notifications.length === 0) {
      handleAddDemoNotification(DEMO, addNotification)
    }
  }, [addNotification, notifications, user])

  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {/* {isMobile ? (
        <NotSupported />
      ) : ( */}
      <AppShell
        fixed={true}
        p={0}
        navbar={showSideBar && !isMobile ? <NavbarSearch /> : null}
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[0],
        })}
        header={
          <PageHeader
            onClick={action}
            label={actionLabel}
            notification={currentMsg}
            total={notifications.length}
            removeMessage={removeNotification}
            isSidebarVisible={showSideBar}
          />
        }
        layout="alt"
      >
        <Suspense fallback={<SuspenseLoader />}>
          <Box h="100%">
            {user?.accountStatus !== 'PENDING' ? (
              children
            ) : (
              <ProfileFormUpdate />
            )}
          </Box>
        </Suspense>
      </AppShell>
      {/* )} */}
    </>
  )
}

export default Layout
