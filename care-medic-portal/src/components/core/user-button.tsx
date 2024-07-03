import {
  Avatar,
  createStyles,
  Group,
  Loader,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
  useMantineTheme,
} from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { getInitialsFromName } from '@utils/helpers'
import Link from 'next/link'

const useStyles = createStyles((theme) => ({
  user: {
    display: 'block',
    width: '100%',
    padding: theme.spacing.xs,
    color: theme.black,
    textAlign: 'left',
    textDecoration: 'none',
  },
}))

interface UserButtonProps extends UnstyledButtonProps {
  name: string
  email: string
  icon?: ReactNode
  showInitials?: boolean
  loading?: boolean
  asLink?: boolean
}

export function UserButton({
  name,
  email,
  icon,
  loading,
  showInitials,
  asLink,
  ...others
}: UserButtonProps) {
  const { classes } = useStyles()
  const Component = asLink ? Link : 'button'
  const theme = useMantineTheme()
  return (
    <UnstyledButton
      className={classes.user}
      {...others}
      href="profile"
      component={Component}
    >
      {loading ? (
        <Group position="center">
          <Loader />
        </Group>
      ) : (
        <Group>
          {showInitials ? (
            <Avatar radius="xl">{getInitialsFromName(name)}</Avatar>
          ) : null}
          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {name}
            </Text>
            <Text color="dimmed" size="xs">
              {email}
            </Text>
          </div>
          {icon || (
            <IconChevronRight
              size="1.5rem"
              stroke={2}
              color={theme.colors.teal[4]}
            />
          )}
        </Group>
      )}
    </UnstyledButton>
  )
}
