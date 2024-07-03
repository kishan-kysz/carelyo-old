import useProfile from '@hooks/use-profile'
import { NextPageWithLayout } from '../_app'
import Layout from '../../components/layout'
import { Box, Grid, Stack, Tabs } from '@mantine/core'
import { useState } from 'react'
import { Invitation } from '@components/profile/invitation'
import Metrics from '@components/profile/metrics'
import WalletPanel from '@components/profile/wallet-panel'
import Accolades from '@components/profile/acccolades'
import About from '@components/profile/about'

const Profile: NextPageWithLayout = () => {
  const { user } = useProfile()
  const [activeTab, setActiveTab] = useState<string>('about')
  return user ? (
    <Box h="100%">
      <Stack justify="space-between" h="100%">
        <Box>
          <Grid>
            <Grid.Col span="auto">
              <Tabs
                onTabChange={setActiveTab}
                value={activeTab}
                keepMounted={false}
                inverted
              >
                <Tabs.List>
                  <Tabs.Tab value="about">About</Tabs.Tab>
                  <Tabs.Tab value="metrics">Metrics</Tabs.Tab>
                  <Tabs.Tab value="accolades">Accolades</Tabs.Tab>
                  <Tabs.Tab value="invitation">Invitations</Tabs.Tab>
                  <Tabs.Tab value="wallet">Wallet</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="about">
                  <About user={user} />
                </Tabs.Panel>
                <Tabs.Panel value="metrics">
                  <Metrics setActiveTab={setActiveTab} />
                </Tabs.Panel>
                <Tabs.Panel value="invitation">
                  <Invitation />
                </Tabs.Panel>
                <Tabs.Panel value="accolades">
                  <Accolades />
                </Tabs.Panel>
                <Tabs.Panel value="wallet">
                  <WalletPanel />
                </Tabs.Panel>
              </Tabs>
            </Grid.Col>
          </Grid>
        </Box>
      </Stack>
    </Box>
  ) : null
}
export default Profile
Profile.getLayout = (page) => <Layout title="Profile">{page}</Layout>
