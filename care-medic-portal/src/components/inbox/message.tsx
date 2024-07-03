import { createRef, useEffect } from 'react'
import {
  Avatar,
  Box,
  Group,
  Indicator,
  Paper,
  Stack,
  Text,
} from '@mantine/core'
import { getInitials } from '@utils/helpers'
import { CgCalendarDates } from 'react-icons/cg'
import { formatDistanceToNow } from 'date-fns'
import { IGetMessagesByUser } from '@types'
import useMessages from '@hooks/use-messages'
import { useRouter } from 'next/router'
import { queryTypes, useQueryState } from 'next-usequerystate'

const MAX_LENGTH = 10

function MessagePreview({
  message,
  isSelected,
}: {
  message: IGetMessagesByUser
  isSelected: boolean
}) {
  const { readMsg } = useMessages()
  const [id, setId] = useQueryState('id', queryTypes.integer)
  const router = useRouter()
  const ref = createRef<HTMLButtonElement>()
  const IS_READ =
    message.sender !== 'Admin' &&
    message.sender !== 'Carelyo' &&
    !message.hasBeenRead
  useEffect(() => {
    // if the id is the same as the message id, focus on the message and scroll to it in the list
    if (id === message.id) {
      ref.current?.focus()
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [id, message.id, ref])
  const openMessage = async () => {
    if (router.pathname !== '/inbox') {
      await router.push({
        hash: 'inbox', // for some reason router.push({ pathname: "inbox", query: { id: message.id } }); doesn't work here, but it does if hash is added
        pathname: 'inbox',
        query: { id: message.id },
      })
    }
    await setId(message.id)
    if (!IS_READ) {
      try {
        await readMsg(message.id)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const timeAgo = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  })
  return (
    <Indicator
      color="lime"
      withBorder
      size={15}
      processing={true}
      disabled={IS_READ}
    >
      <Paper
        component="button"
        ref={ref}
        key={message.id}
        onClick={openMessage}
        role="button"
        p="xs"
        my="xs"
        w="100%"
        withBorder
        sx={() => ({
          border: isSelected ? '1px solid #F8F9FA ' : '1px solid #F8F9FA',
          cursor: 'pointer',
          '&:hover': { backgroundColor: '#c5ebd8' },
          '&:focus': {
            border: '1px solid #4EC59C',
          },
          ':first-of-type': { marginTop: 20 },
        })}
      >
        <Group position="apart">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar size="md" radius="md" color="blue">
              {getInitials(message.sender)}
            </Avatar>
            <Stack spacing={0}>
              <Text fw={700} size="md">
                {message.subject}
              </Text>
              <Text size="xs" color="#10751c" align="start">
                {message.message.slice(0, MAX_LENGTH)}...
              </Text>
            </Stack>
          </Box>
          <Group position="apart">
            {/*{message.sender !== "Admin" && message.sender !== "Carelyo" && (
            <>
              {!hasBeenRead ? null : (
                <Badge
                  style={{ marginLeft: "auto" }}
                  color="green"
                  radius="sm"
                  variant="dot"
                >
                  Read
                </Badge>
              )}
              {!hasBeenRead ? (
                <Badge
                  style={{ marginLeft: "auto" }}
                  color="red"
                  radius="sm"
                  variant="dot"
                >
                  New
                </Badge>
              ) : (
                <></>
              )}
            </>
          )}*/}
            <Text color="black" fw={700} size="sm">
              <CgCalendarDates
                style={{
                  verticalAlign: 'middle',
                  marginRight: '0.25em',
                }}
                size={12}
              />
              {timeAgo}
            </Text>
          </Group>
        </Group>
      </Paper>
    </Indicator>
  )
}
export default MessagePreview
