import {
  Anchor,
  Box,
  Modal,
  Stack,
  Text,
  Title,
  createStyles
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { CookiesBanner } from '../components/CookieBanner'
import Footer from '../components/Footer'
import LoggedIn from '../components/LoggedIn'
import { useMediaQuery } from '@mantine/hooks'
const Layout = () => {
  const accepted = Cookies.get('ca_carelyo_cookies_has-accepted')
  const [opened, { open, close }] = useDisclosure(false)
  const mobile = useMediaQuery('(max-width:625px)')
  // const tablet = useMediaQuery('(min-width:1050px)')
  const { classes } = useStyles()

  useEffect(() => {
    if (!accepted) {
      open()
    }
  }, [accepted])
  const handleAccept = () => {
    Cookies.set('ca_carelyo_cookies_has-accepted', 'true', { expires: 365 })
    close()
  }
  return (
    <Box
      sx={(theme) => ({
        height: '100vh',
        display: `${mobile ? 'block' : 'flex'}`,
        flexWrap: 'wrap'
      })}
    >
      <Box bg={'teal'} className={classes.leftContainer}>
        <Stack justify='space-between' h={'100%'} w={'75%'} m='0px auto'>
          <Anchor
            href={import.meta.env.VITE_CLIENT_URL || '#'}
            my={45}
            target='_blank'
            sx={{
              textDecoration: 'none',
              ':hover': { textDecoration: 'none' }
            }}
          >
            <Title align='left' weight={500} color='white' order={1}>
              {import.meta.env.VITE_TITLE || 'Company name'}
            </Title>
          </Anchor>

          <Text italic size={mobile ? 20 : 24} align='center' color='white'>
            {import.meta.env.VITE_SLOGAN || 'Company slogan'}
          </Text>

          <Box
            mb={75}
            w={'100%'}
            sx={{ gap: 24, alignItems: 'center', justifyContent: 'center' }}
            display='flex'
          >
            <Text className={classes.poweredByText} color='white'>
              Powered by{' '}
            </Text>
            <Anchor
              href={
                import.meta.env.VITE_CARELYO_URL || 'https://dev.carelyo.io/sv'
              }
              target='_blank'
            >
              <img
                className={classes.logoSize}
                src={'/assets/logo.svg'}
                alt='Carelyo logo'
              />
            </Anchor>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, padding: 16, gap: 16, margin: 'auto 0px' }}>
        <Outlet />
        <LoggedIn />
        <Footer />
      </Box>

      <Modal opened={opened} onClose={close} title='Cookies'>
        <CookiesBanner accept={handleAccept} />
      </Modal>
    </Box>
  )
}

const useStyles = createStyles((theme) => ({
  leftContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    flex: 1,
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      backgroundImage: 'url(/assets/madison-lavern-4gcqRf3-f2I-unsplash.jpg)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      opacity: 0.2
    },
    [`@media (max-width:625px)`]: {
      height: '50%'
    }
  },
  poweredByText: {
    fontSize: theme.fontSizes.md,
    [`@media (min-width:625px)`]: {
      fontSize: theme.fontSizes.lg
    },
    [`@media (min-width:1050px)`]: {
      fontSize: theme.fontSizes.xl
    }
  },
  logoSize: {
    width: 100,
    [`@media (min-width:625px)`]: {
      width: 150
    },
    [`@media (min-width:1050px)`]: {
      width: 200
    }
  }
}))

export default Layout
