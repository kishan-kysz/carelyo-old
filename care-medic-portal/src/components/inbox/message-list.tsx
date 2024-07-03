import {
  Box,
  Center,
  Loader,
  Pagination,
  rem,
  ScrollArea,
  Text,
} from '@mantine/core'
import { Fragment, useEffect, useMemo, useState } from 'react'
import MessagePreview from '@components/inbox/message'
import { IGetMessagesByUser } from '@types'

const MessageList = ({
  messages,
  selectedMessage,
  loading,
  query = '',
}: {
  messages: IGetMessagesByUser[]
  selectedMessage?: IGetMessagesByUser
  query?: string
  loading?: boolean
}) => {
  const [filteredMessages, setFilteredMessages] =
    useState<IGetMessagesByUser[]>()
  const messagesPerPage = 10
  const [pages, setPages] = useState(1)
  const from = (pages - 1) * messagesPerPage
  const to = from + messagesPerPage
  const [total, setTotal] = useState<number>()
  const [initialLoad, setInitialLoad] = useState(true)
  useEffect(() => {
    setTotal(Math.ceil(messages?.length / messagesPerPage))
    setFilteredMessages(messages?.slice(from, to))
    // calculate what page this index is on and set the page to that number
    if (selectedMessage) {
      const selectedMessagePage = Math.ceil(
        (messages.indexOf(selectedMessage) + 1) / messagesPerPage,
      )
      // if the selected message is not on the current page, set the page to that number and set initial load to false
      // this prevents the page from resetting  when the user clicks on a message
      if (selectedMessagePage !== pages && initialLoad) {
        setPages(selectedMessagePage)
      }
    }
  }, [messages, from, to, selectedMessage, pages, initialLoad])
  const handleSetPages = (page: number) => {
    setInitialLoad(false)
    setPages(page)
  }

  const memoizedMessages = useMemo(() => {
    if (filteredMessages && query) {
      return filteredMessages.filter(
        (message) =>
          message.subject.toLowerCase().includes(query.toLowerCase()) ||
          message.message.toLowerCase().includes(query.toLowerCase()),
      )
    }
    return filteredMessages
  }, [filteredMessages, query])
  return (
    <Box h={'100%'} p="xs">
      {loading ? (
        <Center h="100%">
          <Loader size="xl" />
        </Center>
      ) : null}
      {!loading && memoizedMessages?.length === 0 ? (
        <Center h={rem(700)}>
          <Text>No messages found</Text>
        </Center>
      ) : (
        <Fragment>
          <ScrollArea h={rem(550)} offsetScrollbars={true}>
            {memoizedMessages?.map((message) => {
              return (
                <MessagePreview
                  message={message}
                  key={message.id}
                  isSelected={selectedMessage?.id === message.id}
                />
              )
            })}
          </ScrollArea>
          <Pagination
            mt={16}
            value={pages}
            color="teal"
            onChange={handleSetPages}
            position="center"
            total={total}
          />
        </Fragment>
      )}
    </Box>
  )
}

export default MessageList
