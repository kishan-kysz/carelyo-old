import { showNotification } from '@mantine/notifications'
import Icon from '../components/NotificationIcons'
import capitalize from './capitalize'

interface ICustomNotification {
  title: string
  message?: string
  loading?: boolean
  type: 'success' | 'error' | 'warning' | 'info'
}
export const customNotification = ({
  title,
  message,
  loading,
  type
}: ICustomNotification) => {
  return showNotification({
    title: capitalize(title),
    message: message && capitalize(message),
    color:
      type === 'success'
        ? 'teal'
        : type === 'error'
          ? 'red'
          : type === 'warning'
            ? 'yellow'
            : 'blue',
    icon: Icon({ type: type }),
    autoClose: 6000,
    loading,
    sx: (theme) => ({
      backgroundColor: theme.colors.gray[3]
    })
  })
}
