import { useForm } from '@mantine/form'
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core'
import { ILabRequest } from '@types'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { HandleCurrent } from '../current/HandleCurrent'
import useLabs from '@hooks/use-labs'
import { IconPlus } from '@tabler/icons-react'
import CreateTestModal from '../modals/create-test-modal'
import { useTests } from '@hooks/use-tests'

const Description = ({ onClick, procedures }) => (
  <Group position="apart">
    <Text>
      Search and select common lab tests - {procedures} tests available
    </Text>
    <Tooltip label="Add a new test">
      <ActionIcon variant="default" size={18} onClick={onClick}>
        <IconPlus size="0.8rem" stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  </Group>
)

const CreateLabForm = ({
  func,
  defaultData,
  type = 'create',
  opened,
  toggle,
}: {
  func: Function
  defaultData?: ILabRequest
  type?: 'create' | 'edit'
  opened: boolean
  toggle: () => void
}) => {
  const { flatData, data } = useTests()
  const procedures = flatData?.flatMap((item) => item.value).length
  const [test, setTest] = useState<string[]>([])

  const categoryData = data?.map((item) => {
    return { label: item.category, value: item.category }
  })

  const testData = data?.map((item) => {
    return { label: item.category, value: item.procedures }
  })

  const form = useForm<{ test: string; reason: string }>({
    initialValues: {
      test: defaultData?.test || '',
      reason: defaultData?.reason || '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {}
      if (!values.test) {
        errors.test = 'Test is required'
      }
      if (!values.reason) {
        errors.reason = 'Reason is required'
      }
      return errors
    },
  })

  const handleSubmit = async () => {
    func(form.values)
    form.reset()
  }
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack mt={24}>
        <CreateTestModal opened={opened} toggle={toggle} />
        <Select
          label="Test category"
          placeholder="Select category"
          clearable={true}
          withAsterisk
          description={<Description onClick={toggle} procedures={procedures} />}
          limit={100}
          onChange={(value) => {
            testData.forEach((testItem) => {
              if (value === testItem.label) {
                setTest(testItem.value)
              }
            })

            if (value === null) {
              setTest([])
            }
            form.clearFieldError('test')
          }}
          nothingFound="No Tests"
          data={categoryData || []}
        />
        {test.length > 0 ? (
          <Select
            withAsterisk
            placeholder="Select tests"
            {...form.getInputProps('test')}
            clearable={true}
            data={test}
            label="Select tests"
          />
        ) : (
          <> </>
        )}
        <Textarea
          withAsterisk
          {...form.getInputProps('reason')}
          label="Reason"
        />
        <Group position="right">
          <Button type="submit" color="#10751c">
            {type === 'create' ? 'Create Lab' : 'Save'}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export default function HandleLab({
  id,
  labs,
}: {
  id: number
  labs: ILabRequest[]
}) {
  const [lab, setLab] = useState<ILabRequest>()
  const [editModalOpen, { close, open }] = useDisclosure(false)
  const [opened, { toggle }] = useDisclosure()
  const [deleteModal, handleDelete] = useDisclosure(false)

  const { editLab, createLab, deleteLab, isLoadingEdit, isLoadingDelete } =
    useLabs({ handleDelete: handleDelete })
  const handleSubmit = async (data) => {
    const requestData = { ...data, consultationId: id }
    await createLab(requestData)
  }

  const handleEditSubmit = async (data) => {
    const requestData = { ...data, id: lab.id }
    if (lab.test === data.test && lab.reason === data.reason) {
      return close()
    }
    close()
    await editLab(requestData)
  }
  const handleSelectEdit = (lab: ILabRequest) => {
    setLab(lab)
    open()
  }
  const handleSelectDelete = (lab: ILabRequest) => {
    setLab(lab)
    handleDelete.open()
  }
  return (
    <Box>
      <HandleCurrent
        data={labs}
        handleSelectEdit={handleSelectEdit}
        handleSelectDelete={handleSelectDelete}
        isLoading={isLoadingEdit}
        type="lab"
      />
      <CreateLabForm opened={opened} toggle={toggle} func={handleSubmit} />
      <Modal
        opened={editModalOpen}
        onClose={close}
        centered={true}
        title="Edit Lab request"
      >
        <CreateLabForm
          func={handleEditSubmit}
          toggle={toggle}
          opened={opened}
          defaultData={lab}
          type="edit"
        />
      </Modal>
      <Modal
        opened={deleteModal}
        onClose={handleDelete.close}
        centered={true}
        title="Delete Lab request"
      >
        <Text>Are you sure you want to delete this lab request?</Text>
        <Text>Test: {lab?.test}</Text>
        <Group position="right" mt="md">
          <Button
            size="xs"
            color="blue"
            loading={isLoadingDelete}
            onClick={handleDelete.close}
          >
            Cancel
          </Button>
          <Button
            size="xs"
            color="red"
            onClick={async () => {
              await deleteLab({ id: lab.id })
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
