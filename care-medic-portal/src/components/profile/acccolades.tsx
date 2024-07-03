import useAccolades from '@hooks/use-accolades'
import { AccoladeSchema, IAccolade } from '@types'
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  List,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import {
  IconEditCircle,
  IconSquareRoundedPlus,
  IconTrashX,
} from '@tabler/icons-react'
import { ConfirmDelete } from '../core/confirm-delete'

const AccoladeNames = [
  {
    label: 'Certification',
    value: 'Certification',
  },
  {
    label: 'Award',
    value: 'Award',
  },
  {
    label: 'Fellowship',
    value: 'Fellowship',
  },
  {
    label: 'Membership',
    value: 'Membership',
  },
  {
    label: 'Publication',
    value: 'Publication',
  },
  {
    label: 'Research',
    value: 'Research',
  },
  {
    label: 'Training',
    value: 'Training',
  },
  {
    label: 'Other',
    value: 'Other',
  },
]
const AccoladeForm = ({
  selected,
  handleSelected,
  loading,
  onSubmit,
}: {
  selected: IAccolade | undefined
  loading: boolean
  handleSelected: (accolade: IAccolade) => void
  onSubmit: (accolade) => Promise<void>
}) => {
  const form = useForm({
    initialValues: selected || {
      name: 'Certification',
      description: '',
      year: 2022,
    },
    validate: zodResolver(AccoladeSchema),
  })
  const handleSubmit = async (data) => {
    await form.validate()
    if (form.isValid) {
      await onSubmit(data)
      handleSelected(undefined)
    }
  }
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Select
          description="Select the type of accolade"
          label="Name"
          {...form.getInputProps('name')}
          data={AccoladeNames}
        />
        <NumberInput
          description="The year you received this accolade"
          label="Year"
          {...form.getInputProps('year')}
        />
        <Textarea
          label="Description"
          description="Describe the accolade what you did and how you achieved it"
          {...form.getInputProps('description')}
        />
        <Button type="submit" variant="outline" loading={loading}>
          Save Accolade
        </Button>
      </Stack>
    </form>
  )
}
const AccoladeItem = ({
  accolade,
  toggleEdit,
  toggleDelete,
  setSelected,
}: {
  accolade: IAccolade
  toggleDelete: () => void
  toggleEdit: () => void
  setSelected: (selected) => void
}) => {
  const handleEdit = () => {
    setSelected(accolade)
    toggleEdit()
  }
  const handleDelete = () => {
    setSelected(accolade)
    toggleDelete()
  }
  return (
    <Paper withBorder p="sm">
      <Group position="apart">
        <Group position="apart">
          <Text>{accolade.name}</Text>
          <Badge color="teal" variant="filled">
            {accolade.year}
          </Badge>
        </Group>
        <Group>
          <ActionIcon color="blue.4" onClick={handleEdit}>
            <IconEditCircle />
          </ActionIcon>
          <ActionIcon color="red.4" onClick={handleDelete}>
            <IconTrashX />
          </ActionIcon>
        </Group>
      </Group>
      <Text size="sm" color="dimmed">
        {accolade.description}
      </Text>
    </Paper>
  )
}
export const AccoladeList = () => {
  const { accolades } = useAccolades()
  return (
    <List size="xs">
      {accolades?.map((accolade) => (
        <List.Item my={5} key={accolade.id}>
          {accolade.name} - {accolade.year}
        </List.Item>
      ))}
    </List>
  )
}
const Accolades = () => {
  const {
    accolades,
    add,
    update,
    remove,
    delLoading,
    addLoading,
    updateLoading,
  } = useAccolades()
  const [selected, setSelected] = useState<IAccolade | undefined>(undefined)
  const [opened, { toggle, close }] = useDisclosure(false)
  const [openedEdit, { toggle: edit, close: closeEdit }] = useDisclosure(false)
  const [openedDelete, { toggle: toggleDelete, close: closeDelete }] =
    useDisclosure(false)
  return (
    <div>
      <Group py="xs" position="apart">
        <Text size="xs" color="gray">
          Add any accolades and achievement you have received
        </Text>
        <Button
          variant="light"
          color="teal"
          onClick={toggle}
          rightIcon={<IconSquareRoundedPlus />}
        >
          New Accolade
        </Button>
      </Group>
      <Stack mt={3}>
        {accolades?.map((accolade) => (
          <AccoladeItem
            accolade={accolade}
            key={accolade.id}
            setSelected={setSelected}
            toggleEdit={edit}
            toggleDelete={toggleDelete}
          />
        ))}
      </Stack>
      <Modal
        opened={opened}
        onClose={close}
        title="Add a new Accolade"
        centered
      >
        <AccoladeForm
          selected={selected}
          handleSelected={setSelected}
          loading={addLoading}
          onSubmit={async (data) => {
            await add(data)

            close()
          }}
        />
      </Modal>
      <Modal
        opened={openedEdit}
        onClose={closeEdit}
        title="Edit Accolade"
        centered
      >
        <AccoladeForm
          loading={updateLoading}
          selected={selected}
          handleSelected={setSelected}
          onSubmit={async (data) => {
            await update(data)
            closeEdit()
          }}
        />
      </Modal>
      <ConfirmDelete
        show={openedDelete}
        onClose={closeDelete}
        onDelete={async () => {
          await remove(selected?.id)
          closeDelete()
        }}
        title="Delete Accolade"
        message="Are you sure you want to delete this Accolade?"
        name={`${selected?.name} - ${selected?.year}`}
        loading={delLoading}
      />
    </div>
  )
}

export default Accolades
