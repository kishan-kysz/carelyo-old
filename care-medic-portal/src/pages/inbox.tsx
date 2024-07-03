import { Container, Grid, Paper } from '@mantine/core'
import { useEffect, useState } from 'react'
import { NextPageWithLayout } from './_app'
import useMessages from '@hooks/use-messages'
import MessageList from '@components/inbox/message-list'
import Message from '@components/inbox/viewed-message'
import Layout from '@components/layout'
import MessageSearch from '@components/inbox/message-search'
import { IGetMessagesByUser } from '@types'
import { parseAsInteger, useQueryState } from 'next-usequerystate'
import { DashboardHeader } from '@components/dashboard/dashboard-header'

const Inbox: NextPageWithLayout = () => {
  const { messages, loading } = useMessages()
  console.log(messages)
  const [query, setQuery] = useState('')
  const [id] = useQueryState('id', parseAsInteger)
  const [selectedMessage, setSelectedMessage] = useState<IGetMessagesByUser>()
  const unreadMessages = messages?.filter(
    (message) =>
      message.sender !== 'Admin' &&
      message.sender !== 'Carelyo' &&
      !message.hasBeenRead,
  ).length
  useEffect(() => {
    const message = messages?.find((message) => message.id === id)
    setSelectedMessage(message)
  }, [messages, id])
  return (
    <Container maw={1600}>
      <MessageSearch setQuery={setQuery} />
      <Grid h="100%" w="100%" p="sm">
        <Grid.Col span={4}>
          <Paper withBorder p="sm" radius="md" h="100%">
            <DashboardHeader
              title="Inbox"
              rightBadge={unreadMessages > 0 ? `${unreadMessages} unread` : ''}
              badgeProps={
                unreadMessages > 0 ? { color: 'red', variant: 'filled' } : {}
              }
            />
            <MessageList
              query={query}
              loading={loading}
              messages={messages}
              selectedMessage={selectedMessage}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col span={8}>
          <Paper withBorder p="md" radius="md" h="100%">
            {selectedMessage ? <Message message={selectedMessage} /> : <div />}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Inbox

Inbox.getLayout = (page) => <Layout title="Inbox">{page} </Layout>
