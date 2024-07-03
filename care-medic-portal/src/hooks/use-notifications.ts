import { useContext, useEffect } from 'react'
import { NotificationContext } from '@components/core/notifcation-context'

export interface INotification {
  message: string
  id?: number
  type: 'success' | 'error' | 'info' | 'warning'
}

interface HeaderMessageProps {
  timeout?: number
}

export interface INotificationContext {
  notifications: INotification[]
  currentId: number
  addNotification: (notification: INotification, duration?: number) => void
  removeNotification: (id: number) => void
  clearNotifications: () => void
  setDuration: (duration: number) => void
}

const useNotification = (settings?: HeaderMessageProps) => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useHeaderMessage must be used within NotificationContextProvider',
    )
  }

  const {
    notifications,
    currentId,
    addNotification,
    clearNotifications,
    removeNotification,
    setDuration,
  } = context

  useEffect(() => {
    if (settings?.timeout) setDuration(settings.timeout)
  }, [settings?.timeout, setDuration])
  return {
    notifications,
    currentId,
    addNotification,
    clearNotifications,
    removeNotification,
  }
}

export default useNotification
