import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Button,
  Group,
  Header,
  Indicator,
  type MantineColor,
  Paper,
  Stack,
  Text,
} from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  IconAlertCircle,
  IconInfoCircle,
  IconMedicalCross,
  IconMedicalCrossOff,
  IconX,
  type TablerIconsProps,
} from '@tabler/icons-react'
import useNotification, { type INotification } from '@hooks/use-notifications'
import useProfile from '@hooks/use-profile'
import { useEffect } from 'react'

export default function PageHeader({
  onClick,
  label,
  notification,
  color = 'teal',
  removeMessage,
  total,
  isSidebarVisible,
}: {
  onClick?: () => void
  label?: string
  notification?: INotification
  removeMessage?: (val: number) => void
  total?: number
  color?: MantineColor
  isSidebarVisible?: boolean
}) {
  const { asPath } = useRouter()
  const pathWithoutQuery = asPath.split('?')[0]
  let pathArray = pathWithoutQuery.split('/')
  pathArray.shift()
  pathArray = pathArray.filter((path) => path !== '')

  const { addNotification, clearNotifications } = useNotification()
  const { user } = useProfile()
  const userName = user?.lastName || 'User'

  //notifications
  const notificationType = notification?.type
  type RecordTypeColor = Record<typeof notificationType, MantineColor>
  type RecordTypeIcon = Record<
    typeof notificationType,
    (props: TablerIconsProps) => JSX.Element
  >
  const TypeIcon: RecordTypeIcon = {
    error: IconAlertCircle,
    success: IconMedicalCross,
    info: IconInfoCircle,
    warning: IconMedicalCrossOff,
  }
  const TypeColor: RecordTypeColor = {
    error: 'red',
    success: 'green',
    info: 'blue',
    warning: 'yellow',
  }
  const notificationColor = TypeColor[notificationType]
  const Icon = TypeIcon[notificationType]

  useEffect(() => {
    const handleBrowserBack = () => {
      addNotification({
        message: `Dr. ${userName}, you have a consultation is in progress!`,
        type: 'error',
      })

      window.history.pushState(null, '', document.URL)
    }

    window.history.pushState(null, '', document.URL)
    window.addEventListener('popstate', handleBrowserBack)

    return () => {
      window.removeEventListener('popstate', handleBrowserBack)
    }
  }, [addNotification, userName])

  return (
    <Header
      height={80}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Group w="100%" px="md" align="center" position="apart">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="/"
          sx={{ flexWrap: 'wrap' }}
        >
          {pathArray.includes('consultation') ? (
            <Text transform="capitalize" color="dimmed" aria-current="page">
              Dashboard
            </Text>
          ) : (
            <Anchor
              href="/"
              color="teal"
              component={Link}
              sx={{ textDecoration: 'none' }}
            >
              Dashboard
            </Anchor>
          )}
          {pathArray.map((value, index) => {
            const last = index === pathArray.length - 1
            const to = `/${pathArray.slice(0, index + 1).join('/')}`
            return (
              <Text transform="capitalize" key={to} color="dimmed">
                {value}
              </Text>
            )
          })}
        </Breadcrumbs>
        {notification ? (
          <Paper
            sx={(theme) => ({
              borderRadius: '1rem',
              cursor: 'pointer',
              textAlign: 'center',
              color: theme.colors[notificationColor][5],
              fontWeight: 600,
            })}
          >
            <Indicator
              position="bottom-end"
              label={total}
              disabled={total <= 1}
              size={16}
              sx={(theme) => ({
                color: theme.fn.darken(theme.colors[notificationColor][5], 0.5),
              })}
            >
              <Group position="apart">
                <Icon size={20} radius={10} />
                {notification.message}
                <ActionIcon
                  onClick={() => removeMessage(notification.id)}
                  color={notificationColor}
                  radius="xl"
                >
                  <IconX />
                </ActionIcon>
              </Group>
            </Indicator>
          </Paper>
        ) : null}
        {
          <Group position="center">
            <Stack spacing={0}>
              <Text fw={900} color="#dbb80a">
                {process.env.NEXT_PUBLIC_PROVIDER_NAME}
              </Text>
              <Text color="dimmed" align="center" size="0.5rem">
                Powered By{' '}
                <Text size="0.9rem" align="center" color="teal" span>
                  Carelyo
                </Text>
              </Text>
            </Stack>
            <Stack>
              {/* <Image src="/logo.svg" alt="Carelyo Logo" height={80} width={90} /> */}
            </Stack>
          </Group>
        }
        {onClick && (
          <Button color={color} size="xs" m={0} onClick={onClick}>
            {label ?? 'New '}
          </Button>
        )}
      </Group>
    </Header>
  )
}
