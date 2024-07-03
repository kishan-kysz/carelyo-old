import {
  ActionIcon,
  Badge,
  Button,
  Center,
  createStyles,
  Group,
  Menu,
  Navbar,
  rem,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import Image from 'next/image'
import {
  IconCheckbox,
  IconHome,
  IconInbox,
  IconLogout,
  IconPhoneCall,
  IconPlus,
  IconUser,
} from '@tabler/icons-react'
import { UserButton } from '../core/user-button'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useProfile from '@hooks/use-profile'
import { isNull } from 'is-what'
import { useEffect, useState } from 'react'
import useConsultation from '@hooks/use-consultation'
import { useSession } from '@hooks/use-session'
import { IS_LOCAL } from '@utils/env'
import { IconList } from '@tabler/icons-react'

const useStyles = createStyles((theme) => ({
  navbar: {
    background: theme.white,
    transition: 'all 0.3s ease-out 0.3s',
    //backgroundImage: `linear-gradient(to top left, ${theme.colors.gray[0]}, ${theme.colors.blue[2]})`,
    backdropFilter: 'blur(8px)',
  },
  section: {
    marginBottom: theme.spacing.md,
    '&:not(:last-of-type)': {
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },
  topSection: {
    minHeight: 'var(--mantine-header-height)',
    display: 'flex',
    alignItems: 'center',
  },
  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md,
  },
  mainLink: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.fontSizes.md,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color: theme.colors.dark[4],
    '&:hover': {
      background: theme.fn.rgba(theme.colors.dark[2], 0.25),
      transition: '0.6s ease',
    },
  },
  mainLinkInner: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color: theme.colors.teal[5],
  },
  mainLinkBadge: {
    padding: 0,
    width: rem(20),
    height: rem(20),
    pointerEvents: 'none',
  },
  collections: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md,
  },
  collectionsHeader: {
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5),
  },
  collectionLink: {
    display: 'block',
    padding: `${rem(8)} ${theme.spacing.xs}`,
    textDecoration: 'none',
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.sm,
    lineHeight: 1,
    fontWeight: 500,
    color: theme.colors.dark[4],
    '&:hover': {
      background: theme.fn.rgba(theme.colors.dark[2], 0.25),
      transition: '0.6s ease',
    },
  },
}))
const collections = [
  { emoji: '💁‍', label: 'Patients' },
  { emoji: '🛒', label: 'Services' },
  { emoji: '📈', label: 'Analytics' },
  { emoji: '📊', label: 'Reports' },
  { emoji: '💰', label: 'Earnings' },
  { emoji: '📝', label: 'Doctors' },
]
export function NavbarSearch() {
  const { classes, cx } = useStyles()
  const router = useRouter()
  const goto = async (href) => {
    if (router.pathname === href) return
    await router.replace(href)
  }
  const [activeConsultation, setActiveConsultation] = useState<{
    id: number
    roomName: string
    status: string
    patientName: string
  }>(null)
  const { user, isLoading } = useProfile()
  const { data } = useConsultation()
  const { logout } = useSession()
  const mainLinks = [
    {
      icon: IconHome,
      label: 'Dashboard',
      notifications: data?.length,
      href: '/',
    },
    {
      icon: IconCheckbox,
      label: 'Calendar',
      href: '/calendar',
    },
    { icon: IconUser, label: 'Support', href: '/support' },
    { icon: IconInbox, label: 'Inbox', href: '/inbox' },
    { icon: IconUser, label: 'Profile', href: '/profile' },
    { icon: IconList, label: 'Patient List', href: '/patientlist' },
  ].map((link) => (
    <UnstyledButton
      key={link.label}
      className={classes.mainLink}
      onClick={() => goto(link.href)}
    >
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {link.notifications && link.notifications >= 1 ? (
        <Tooltip label={`${link.notifications} in Queue`}>
          <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
            {link.notifications}
          </Badge>
        </Tooltip>
      ) : null}
    </UnstyledButton>
  ))
  const collectionLinks = collections.map((collection) => (
    <Link href="#" key={collection.label} className={classes.collectionLink}>
      <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
        {collection.emoji}
      </span>{' '}
      {collection.label}
    </Link>
  ))
  const fullName = `Dr. ${user?.firstName} ${user?.lastName}`
  useEffect(() => {
    const activeConsultationId = !!user?.activeConsultation?.id
    if (activeConsultationId) {
      setActiveConsultation(user?.activeConsultation)
    } else {
      setActiveConsultation(null)
    }
  }, [user])

  const hasActiveConsultation =
    !!user?.activeConsultation && user?.activeConsultation?.roomName !== null

  return (
    <Navbar width={{ sm: 200, md: 250 }} className={classes.navbar}>
      <Navbar.Section className={cx(classes.topSection, classes.section)}>
        <UserButton
          loading={isLoading}
          name={fullName}
          asLink={!hasActiveConsultation}
          email={
            hasActiveConsultation
              ? `Join ${activeConsultation?.patientName}'s consultation`
              : user?.hospital
          }
          icon={
            hasActiveConsultation && (
              <Tooltip
                label={`Join ${activeConsultation?.patientName}'s consultation`}
              >
                <ThemeIcon
                  color="#C3FF36"
                  c="dark"
                  variant="light"
                  size="md"
                  sx={{
                    // animate background color
                    animation: 'pulse 2s infinite',
                  }}
                  role="button"
                  onClick={() =>
                    window.location.replace(
                      `/consultation/${activeConsultation?.roomName}`,
                    )
                  }
                >
                  <IconPhoneCall size={28} stroke={1.5} />
                </ThemeIcon>
              </Tooltip>
            )
          }
        />
      </Navbar.Section>
      <Navbar.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </Navbar.Section>

      {IS_LOCAL ? (
        <Navbar.Section className={classes.section}>
          <Group className={classes.collectionsHeader} position="apart">
            <Text size="xs" weight={500} color="dimmed">
              Management
            </Text>
            <Tooltip label="Menu" withArrow position="right">
              <ActionIcon variant="default" size={18}>
                <IconPlus size="0.8rem" stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <div className={classes.collections}>{collectionLinks}</div>
        </Navbar.Section>
      ) : null}

      <Navbar.Section
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Center
          sx={{
            flex: '1 1 auto',
          }}
        >
          <Stack>
            <Text fw={900} color="#dbb80a">
              {process.env.NEXT_PUBLIC_PROVIDER_NAME}
            </Text>
            <Text
              style={{
                fontSize: '0.5rem',
                fontWeight: 100,
                color: 'gray',
                textAlign: 'center',
              }}
            >
              Powered By
              <br />
              <br />
              <br />
              <Text size="0.6rem" align="center" weight={100} color="black">
                <Image
                  src="/logo.svg"
                  alt="Carelyo Logo"
                  height={60}
                  width={100}
                />
                <br />
                Copyright &copy; {new Date().getFullYear()}
              </Text>
            </Text>
          </Stack>
        </Center>
        <Button
          variant="filled"
          color="white"
          radius="xs"
          fullWidth
          onClick={logout}
          rightIcon={<IconLogout size={14} stroke={1.5} />}
        >
          Logout
        </Button>
      </Navbar.Section>
    </Navbar>
  )
}
