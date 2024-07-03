import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  createStyles,
  Modal,
  Paper,
  ScrollArea,
  Text,
} from '@mantine/core'
import { BsTrash, BsXCircle } from 'react-icons/bs'
import { CgCalendarDates } from 'react-icons/cg'
import { getInitials, utcToLocal } from '@utils/helpers'
import { useDisclosure } from '@mantine/hooks'
import { IGetMessagesByUser } from '@types'
import useMessages from '@hooks/use-messages'

const Message = ({ message }: { message: IGetMessagesByUser }) => {
  const utcTimestamp = message.createdAt
  const localTime = utcToLocal(utcTimestamp)
  const { mutateDeleteMsg } = useMessages()
  const [opened, { open, close }] = useDisclosure(false)
  const { classes } = useStyles()

  const handleDeleteMessage = async () => {
    await mutateDeleteMsg(message.id)
    close()
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        padding="xs"
        style={{ fontWeight: 'bold', textAlign: 'center' }}
        title="Delete message"
      >
        <Box className={classes.modalBody}>
          <Text size="md">Are you sure you want to delete this mail?</Text>
          <Box className={classes.modalButtonContainer}>
            <Button
              size="md"
              color="red"
              onClick={handleDeleteMessage}
              sx={{ mr: 'sm' }}
            >
              <BsTrash size={20} />
              <Text ml="xs">Confirm</Text>
            </Button>
            <Button size="md" onClick={() => close()}>
              <BsXCircle size={20} />
              <Text ml="xs">Cancel</Text>
            </Button>
          </Box>
        </Box>
      </Modal>
      <Paper
        style={{ display: 'flex', alignItems: 'center' }}
        key={message.id}
        withBorder
        p="xs"
      >
        <Box style={{ marginRight: 15 }}>
          <Avatar size={48} radius="md" color="blue">
            {getInitials(message.sender)}
          </Avatar>
        </Box>
        <Box>
          <Text fz="md" fw={700}>
            From: {message.sender} {''}
            <CgCalendarDates
              style={{
                verticalAlign: 'middle',
                marginRight: '0.25em',
              }}
              size={18}
            />
            {''}
            {localTime.slice(0, 16)}
          </Text>
          <Text fz="sm" fw={500} c="dimmed">
            Subject: {message.subject}
          </Text>
        </Box>
        {message.sender !== 'Admin' && message.sender !== 'Carelyo' ? (
          <Box style={{ marginLeft: 'auto' }}>
            <ActionIcon
              variant="transparent"
              aria-label="Delete email"
              onClick={open}
              color="red"
            >
              <BsTrash size={20} />
            </ActionIcon>
          </Box>
        ) : (
          <></>
        )}
      </Paper>
      <Box
        sx={() => ({
          display: 'none',
          '@media (min-width: 600px)': {
            display: 'block',
            width: '100%',
          },
        })}
      >
        <ScrollArea p={24}>
          {/*   {router.pathname !== "/inbox" && (
            <button type="button" onClick={() => setSelectedMessage(null)}>
              <CgArrowLongLeft />
            </button>
          )} */}
          <Text
            fz="lg"
            // rome-ignore lint/security/noDangerouslySetInnerHtmlWithChildren: <explanation>
            // rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: message.message }}
          />
        </ScrollArea>
      </Box>
    </>
  )
}
export default Message

const useStyles = createStyles((theme) => ({
  modalBody: {
    textAlign: 'center',
    padding: theme.spacing.md,
  },
  modalButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
}))
