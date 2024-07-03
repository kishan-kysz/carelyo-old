import {
  Accordion,
  Badge,
  Box,
  Button,
  Center,
  createStyles,
  Group,
  Loader,
  Modal,
  Pagination,
  Paper,
  rem,
  ScrollArea,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { Fragment, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createInquiry, getInquiries } from '@routes'
import useProfile from '../../hooks/use-profile'
import { convertFileToBase64, formatDate } from '@utils/helpers'
import CustomDropZone from '@components/support/drop-zone'
import { ICreateInquiryRequest, IInquiry } from '@types'
import { useDisclosure } from '@mantine/hooks'
import { IconSquareRoundedPlus } from '@tabler/icons-react'
import { useSession } from '@hooks/use-session'
import { IconCalendar } from '@tabler/icons-react'

export const Inquiry = () => {
  const [opened, { toggle, close }] = useDisclosure(false)

  return (
    <Box>
      <InquiryList toggle={toggle} />
      <Modal opened={opened} onClose={close} size="xl">
        <InquiryForm close={close} />
      </Modal>
    </Box>
  )
}
const InquiryForm = ({ close }: { close: () => void }) => {
  const { classes } = useStyles()
  const { user } = useProfile()

  const [showInput, setShowInput] = useState<boolean>(false)
  const [subject, setSubject] = useState<string>('')
  const [other, setOther] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const { mutateAsync, isLoading } = useMutation(createInquiry)

  const MAX_LENGTH_SUBJECT = 50
  const MAX_LENGTH_MESSAGE = 500
  const MAX_AMOUNT_IMAGES = 3

  const form = useForm<ICreateInquiryRequest>({
    initialValues: {
      subject: '',
      message: '',
      images: [],
    },
  })

  const onSelectChange = (value: string) => {
    setShowInput(value === 'other')
    setSubject(value)
    form.setFieldValue('subject', supportOptions[value])
  }

  const updateImages = async (value: File[]) => {
    const base64files = await transformImages(value)
    form.setFieldValue('images', base64files)
  }

  return (
    <Box>
      <Box className={classes.greeting}>
        <Text fz="lg" fw={700}>
          {`Hi, ${user?.firstName}!`}
        </Text>
        <Text fz="md">Please explain the problem you are having.</Text>
      </Box>

      <form
        onSubmit={form.onSubmit(
          async (values) =>
            await mutateAsync(values, {
              onSuccess: () => {
                form.reset()
                setShowInput(false)
                setSubject('')
                setOther('')
                setMessage('')
                showNotification({
                  title: 'Success',
                  message: 'Your inquiry has been sent successfully',
                  autoClose: 2500,
                })
              },
              onError: () => {
                showNotification({
                  title: 'Error',
                  message: 'Something went wrong, please try again later',
                  autoClose: 2500,
                })
              },
              onSettled: () => {
                close()
              },
            }),
        )}
      >
        <Select
          label="Subject"
          placeholder="Select subject"
          required={true}
          value={subject}
          onChange={onSelectChange}
          data={selectData}
        />

        {showInput && (
          <Box sx={{ position: 'relative' }}>
            <TextInput
              label="Other"
              placeholder="Enter subject"
              mt="md"
              name="subject"
              variant="filled"
              required={true}
              value={other}
              onChange={(e) => {
                if (e.target.value.length > MAX_LENGTH_SUBJECT) {
                  return
                }
                setOther(e.target.value)
                form.setFieldValue('subject', e.target.value)
              }}
            />
            <Text className={classes.maxLengthText}>
              {other.length} / {MAX_LENGTH_SUBJECT}
            </Text>
          </Box>
        )}

        <Box sx={{ position: 'relative' }}>
          <Textarea
            mt="md"
            label="Message"
            placeholder="Tell us more about your problem"
            maxRows={10}
            minRows={5}
            autosize={true}
            name="message"
            variant="filled"
            required={true}
            value={message}
            onChange={(e) => {
              if (e.target.value.length > MAX_LENGTH_MESSAGE) {
                return
              }
              setMessage(e.target.value)
              form.setFieldValue('message', e.target.value)
            }}
          />
          <Text className={classes.maxLengthText}>
            {message.length} / {MAX_LENGTH_MESSAGE}
          </Text>
        </Box>
        <CustomDropZone
          maxAmount={MAX_AMOUNT_IMAGES}
          setFieldValue={updateImages}
        />

        <Group position="center" mt="xl">
          <Button type="submit" size="md" loading={isLoading}>
            Send
          </Button>
        </Group>
      </form>
    </Box>
  )
}
const InquiryItem = ({ inquiry }: { inquiry: IInquiry }) => {
  return (
    <Accordion.Item value={inquiry.id.toString()} my="xs">
      <Accordion.Control>
        <Group position="apart">
          <Stack spacing={0}>
            <Text color="dimmed">Subject</Text>
            <Text size="lg">{inquiry.subject}</Text>
          </Stack>
          <Badge color="primary">{inquiry.status}</Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Text>{inquiry.message}</Text>
        <Group position="right" mt="xs">
          <Text color="purple">{formatDate(inquiry.createdAt)}</Text>
          <IconCalendar />
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
const InquiryList = ({ toggle }: { toggle: () => void }) => {
  const { user } = useSession()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<string>('50')
  const { data: inquiries, isLoading } = useQuery(
    ['inquiries', page, limit, user?.userId],
    () =>
      getInquiries({ page: 0, userId: parseInt(user?.userId), size: limit }),
    {
      enabled: !!user?.userId,
    },
  )

  const TOTAL_PAGES = useMemo(
    () => Math.ceil(inquiries?.numberOfElements / parseInt(limit || '0')),
    [inquiries?.numberOfElements, limit],
  )

  const SelectLimit = () => {
    const DEFAULT_DATA = [
      { label: '50', value: '50' },
      { label: '100', value: '100' },
      { label: '150', value: '150' },
      { label: '200', value: '200' },
      { label: 'ALL', value: '' },
    ]

    return (
      <Group align="center">
        <Text size="xs" color="gray">
          Fetch {limit === '' ? 'all' : limit} inquiries
        </Text>
        <Select
          w={rem(80)}
          size="xs"
          data={DEFAULT_DATA}
          value={limit}
          onChange={(value) => {
            setLimit(value)
            setPage(0)
          }}
        />
      </Group>
    )
  }

  return (
    <Paper withBorder={true} p="sm" radius="sm">
      {isLoading ? (
        <Center h={rem(500)}>
          <Loader />
        </Center>
      ) : (
        <Fragment>
          <Group py="xs" position="apart" noWrap>
            <Stack spacing={0}>
              <Text size="xs" color="gray">
                View and create new inquiries
              </Text>
              <SelectLimit />
            </Stack>
            <Button
              variant="light"
              color="teal"
              onClick={toggle}
              rightIcon={<IconSquareRoundedPlus />}
            >
              New Inquiry
            </Button>
          </Group>
          <ScrollArea h={rem(500)}>
            {inquiries?.content.map((inquiry) => (
              <Accordion key={inquiry.id} variant="contained">
                <InquiryItem key={inquiry.id} inquiry={inquiry} />
              </Accordion>
            ))}
          </ScrollArea>
          <Pagination
            total={TOTAL_PAGES}
            onChange={(page) => setPage(page - 1)}
            value={page + 1}
          />
        </Fragment>
      )}
    </Paper>
  )
}

const supportOptions = {
  option1: 'Change healthcare provider',
  option2: 'Provide feedback',
  option3: 'Booked consultation but no call from doctor',
  option4: 'Payment help',
  option5: 'Can not add child',
  option6: 'Child added but not found',
  option7: 'Created child account but can not see my child',
  option8: 'Change nationality number',
  option9: 'Can not update profile',
  option10: 'Error while booking a consultation for my child',
  option11: 'Change password',
  option12: 'Can not see receipt',
  option13: 'Can not see my consultation history',
  option14: 'Can not see my doctors note',
  option15: 'Can not see drug prescription',
  option16: 'Can not see follow up',
  option17: 'Can not see lab requests',
  option18: 'Page not loading',
  option19: 'Other',
}
const selectData = Object.keys(supportOptions).map((key) => ({
  value: key,
  label: supportOptions[key],
}))
export const transformImages = async (value: File[]) => {
  return await Promise.all(
    value.map(async (file) => {
      return {
        encodedContent: await convertFileToBase64(file),
        objectName: file.name,
      }
    }),
  )
}

const useStyles = createStyles(({ colors }) => ({
  greeting: {
    background: '#f1f1f1',
    padding: '1rem',
    borderRadius: '.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  maxLengthText: {
    position: 'absolute',
    top: 4,
    right: 0,
    fontSize: '.8rem',
    color: colors.gray[6],
  },
}))
