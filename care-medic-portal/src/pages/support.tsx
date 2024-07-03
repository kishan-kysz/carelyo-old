import {
  Anchor,
  Box,
  Breadcrumbs,
  Container,
  Divider,
  SimpleGrid,
} from '@mantine/core'
import { SupportBanner } from '@components/support/support-banner'
import useProfile from '@hooks/use-profile'
import { capitalize } from '@utils/helpers'
import { FaBookOpen } from 'react-icons/fa'
import { SupportCard } from '@components/support/support-card'
import { useState } from 'react'
import { MdSupportAgent } from 'react-icons/md'
import { RiQuestionAnswerFill } from 'react-icons/ri'
import { IconQuestionMark } from '@tabler/icons-react'
import { Faq } from '@components/support/faq'
import { NextPageWithLayout } from './_app'
import Layout from '../components/layout'
import { Inquiry } from '@components/support/Inquiries'

type activeTab = 'support' | 'faq' | 'inquiry' | 'getting-started'
const SupportCenter = ({ handleTabChange }) => {
  return (
    <SimpleGrid cols={2} spacing={10}>
      <SupportCard
        title="Getting Started"
        description="Learn how to get started with Carelyo"
        icon={<FaBookOpen size={28} />}
        btnColor="grape.4"
        btnText="Take me there"
        action={() => {
          handleTabChange('getting-started')
        }}
      />
      <SupportCard
        title="Your Inquiries"
        description="View your inquiries and their status"
        btnText="View inquiries"
        btnColor="blue.4"
        icon={<IconQuestionMark size={28} />}
        action={() => {
          handleTabChange('inquiry')
        }}
      />
      <SupportCard
        title="Frequency Asked Questions"
        description="Find answers to common questions"
        icon={<RiQuestionAnswerFill size={28} />}
        btnColor="teal.4"
        btnText="View FAQs"
        action={() => {
          handleTabChange('faq')
        }}
      />
      <SupportCard
        title="Contact Support"
        description="Get in touch with our support team"
        icon={<MdSupportAgent size={28} />}
        btnColor="yellow.4"
        btnText="Contact us"
        action={() => {
          handleTabChange('support')
        }}
      />
    </SimpleGrid>
  )
}

const Support: NextPageWithLayout = () => {
  const [breadcrumbs, setBreadCrumbs] = useState<
    { title: string; tab: activeTab }[]
  >([
    {
      title: 'Support Center',
      tab: 'support',
    },
  ])
  const [activeTab, setActiveTab] = useState<activeTab>('support')

  const { user } = useProfile()
  const fullName = `${capitalize(user?.firstName)} ${capitalize(
    user?.lastName,
  )} `
  const handleTabChange = (tab: activeTab) => {
    setActiveTab(tab)
    if (tab === 'support') {
      setBreadCrumbs([{ title: 'Support Center', tab: 'support' }])
    }
    if (tab === 'faq') {
      setBreadCrumbs([
        { title: 'Support Center', tab: 'support' },
        { title: 'FAQ', tab: 'faq' },
      ])
    }
    if (tab === 'inquiry') {
      setBreadCrumbs([
        { title: 'Support Center', tab: 'support' },
        { title: 'Your Inquiries', tab: 'inquiry' },
      ])
    }
    if (tab === 'getting-started') {
      setBreadCrumbs([
        { title: 'Support Center', tab: 'support' },
        { title: 'Getting Started', tab: 'getting-started' },
      ])
    }
  }
  const handleActiveTab = () => {
    switch (activeTab) {
      case 'support':
        return <SupportCenter handleTabChange={handleTabChange} />
      case 'faq':
        return <Faq />
      case 'inquiry':
        return <Inquiry />
      case 'getting-started':
        return <div>Getting Started</div>
      default:
        return <SupportCenter handleTabChange={handleTabChange} />
    }
  }
  return (
    <Box>
      <Container size="xl">
        <SupportBanner name={fullName} />
        <Breadcrumbs separator="/">
          {breadcrumbs.map((breadcrumb) => (
            <Anchor
              key={breadcrumb.title}
              color={breadcrumb.tab !== activeTab ? 'teal' : 'gray.7'}
              sx={{
                cursor: 'pointer',
                ':hover': {
                  textDecoration: 'none',
                },
              }}
              onClick={() => handleTabChange(breadcrumb.tab)}
            >
              {breadcrumb.title}
            </Anchor>
          ))}
        </Breadcrumbs>
        <Divider my="md" />
        <Box>{handleActiveTab()}</Box>
      </Container>
    </Box>
  )
}

Support.getLayout = (page) => <Layout title="Support Center">{page} </Layout>

export default Support
