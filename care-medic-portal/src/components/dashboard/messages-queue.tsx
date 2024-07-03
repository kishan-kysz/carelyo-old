import { DashboardHeader } from './dashboard-header'
import useMessages from '@hooks/use-messages'
import { Box, Group, Loader } from '@mantine/core'
import MessageList from '@components/inbox/message-list'

const InboxMessages = () => {
  const { messages, loading } = useMessages()

  return !loading ? (
    <Box>
      <DashboardHeader title="Dashboard inbox" path="/inbox" />
      <MessageList messages={messages} loading={loading} />
    </Box>
  ) : (
    <Group position="center">
      <Loader size="xl" />
    </Group>
  )
}

export default InboxMessages
