import { useForm } from '@mantine/form'
import { CreateFollowUp, IFollowUp } from '@types'
import {
  Accordion,
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import useFollowup from '@hooks/use-followup'
import { DateTimePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import 'react-datepicker/dist/react-datepicker.css'
import { IconCalendar } from '@tabler/icons-react'
import { useState } from 'react'
import { formatDate } from '@utils/helpers'

const CurrentFollowup = ({
  data,
  handleSelectEdit,
  handleSelectDelete,
  isLoading,
}: {
  data: IFollowUp
  handleSelectEdit: () => void
  handleSelectDelete: () => void
  isLoading: boolean
}) => {
  return (
    <Box>
      <Text>
        {data ? ' Labs for current consultation' : 'No labs created yet'}
      </Text>
      <Accordion key={data.id} title={formatDate(data.followUpDate)}>
        <Accordion.Item value={data.location}>
          <Accordion.Control>
            <Group position="apart">
              <Text>{data.location}</Text>
              <Text>{formatDate(data.followUpDate)}</Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Text>{data.purpose}</Text>
            <Group position="right">
              <Button
                size="xs"
                color="blue"
                loading={isLoading}
                onClick={handleSelectEdit}
              >
                Edit
              </Button>
              <Button size="xs" color="red" onClick={handleSelectDelete}>
                Delete
              </Button>
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  )
}

const FollowUpForm = ({
  func,
  defaultData,
  type = 'create',
  isLoading,
}: {
  func: Function
  defaultData?: IFollowUp
  type?: 'create' | 'edit'
  isLoading: boolean
}) => {
  const ONE_DAY = 86_400_000
  const form = useForm<Omit<CreateFollowUp, 'consultationId'>>({
    initialValues: {
      followUpDate: defaultData?.followUpDate
        ? new Date(defaultData?.followUpDate)
        : new Date(Date.now() + ONE_DAY),
      purpose: defaultData?.purpose || '',
      location: defaultData?.location || 'Digital',
    },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.followUpDate) {
        errors.followUpDate = 'You must select a follow up date'
      }
      if (values.purpose.length > 100) {
        errors.purpose = "Purpose can't be more than 100 characters"
      }
      if (values.purpose.length <= 10) {
        errors.purpose = "Purpose can't be less than 10 characters"
      }
      if (!values.location) {
        errors.location = 'Please select a valid location'
      }
      return errors
    },
  })
  const [startDate, setStartDate] = useState<Date | null>(
    new Date(form.values?.followUpDate),
  )
  const handleSubmit = async (data) => {
    await func(data)
    form.reset()
  }
  const handleDateChange = (date) => {
    setStartDate(date)
    form.setFieldValue('followUpDate', date)
  }
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <DateTimePicker
          required={true}
          icon={<IconCalendar size="1.1rem" stroke={1.5} />}
          description="When is the follow up"
          {...form.getInputProps('followUpDate')}
          label="Follow Up Date"
        />
        <Select
          description="Is this a digital or physical follow up"
          data={[
            { label: 'Physical Follow up', value: 'Physical' },
            { label: 'Digital Follow up', value: 'Digital' },
          ]}
          {...form.getInputProps('location')}
          label="Location"
        />
        <Textarea
          {...form.getInputProps('purpose')}
          label="Purpose"
          description="Describe the purpose of the followup"
        />
        <Group position="right">
          <Button type="submit" color="#10751c" loading={isLoading}>
            {type === 'create' ? 'Create Follow-up' : 'Save'}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default function HandleFollowUp({
  id,
  data,
}: {
  id: number
  data: IFollowUp
}) {
  const [editModalOpen, { close, open }] = useDisclosure(false)
  const [deleteModal, handleDelete] = useDisclosure(false)
  const { create, edit, cancel, isLoadingEdit, isLoadingCreate, isLoadingDel } =
    useFollowup()
  const handleSubmit = async (data) => {
    const { followUpDate, ...rest } = data
    await create({
      consultationId: id,
      followUpDate: dayjs(followUpDate).toISOString(),
      ...rest,
    })
    close()
  }
  const handleEditSubmit = async (input) => {
    await edit({
      id: data.id,
      ...input,
    })
    close()
  }

  return (
    <Box>
      {data ? (
        <CurrentFollowup
          data={data}
          handleSelectEdit={open}
          handleSelectDelete={handleDelete.open}
          isLoading={isLoadingEdit}
        />
      ) : (
        <FollowUpForm func={handleSubmit} isLoading={isLoadingCreate} />
      )}

      <Modal
        opened={editModalOpen}
        onClose={close}
        centered={true}
        title="Edit follow up"
      >
        <FollowUpForm
          func={handleEditSubmit}
          defaultData={data}
          type="edit"
          isLoading={isLoadingEdit}
        />
      </Modal>
      <Modal
        opened={deleteModal}
        onClose={handleDelete.close}
        centered={true}
        title="Delete Lab request"
      >
        <Text>Are you sure you want to delete this </Text>
        <Text>T</Text>
        <Group position="right" mt="md">
          <Button size="xs" color="blue" onClick={handleDelete.close}>
            Cancel
          </Button>
          <Button
            size="xs"
            color="red"
            loading={isLoadingDel}
            onClick={async () => {
              await cancel(data.id)
              handleDelete.close()
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Box>
  )
}
