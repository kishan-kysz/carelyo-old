import { useLocalStorage } from '@mantine/hooks'
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { INotification, INotificationContext } from '@hooks/use-notifications'

export const NotificationContext =
  React.createContext<INotificationContext>(undefined)

export const NotificationContextProvider: React.FC<{
  duration?: number
  children: ReactElement
}> = ({ duration, children }) => {
  const [messages, setMessages] = useLocalStorage<INotification[]>({
    key: 'notifications',
    defaultValue: [],
  })
  const [autoClose, setAutoClose] = useState(duration || 1500)
  const currentId = messages.length > 0 ? messages[messages.length - 1].id : 0
  const setDuration = useCallback(
    (duration: number) => {
      setAutoClose(duration)
    },
    [setAutoClose],
  )
  const addMessage = useCallback(
    (message: INotification, duration?: number) => {
      setMessages([...messages, { id: currentId + 1, ...message }])
      setDuration(duration || 1500)
    },
    [currentId, messages, setDuration, setMessages],
  )

  const removeMessage = useCallback(
    (id: number) => {
      setMessages(messages.filter((message) => message.id !== id))
    },
    [messages, setMessages],
  )

  const clearMessages = useCallback(() => {
    messages.forEach((message) => {
      removeMessage(message.id)
    })
  }, [messages, removeMessage])

  useEffect(() => {
    if (messages.length > 0) {
      const timeoutId = setTimeout(() => {
        removeMessage(messages[0].id)
      }, autoClose)
      return () => clearTimeout(timeoutId)
    }
  }, [addMessage, messages, removeMessage, autoClose])

  const contextValue = useMemo(() => {
    return {
      notifications: messages,
      currentId,
      setDuration,
      addNotification: addMessage,
      removeNotification: removeMessage,
      clearNotifications: clearMessages,
    }
  }, [
    messages,
    currentId,
    setDuration,
    addMessage,
    removeMessage,
    clearMessages,
  ])
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}
