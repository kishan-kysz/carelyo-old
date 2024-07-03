import useInvitation from '@hooks/use-invitation'
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import {
  IconMessageForward,
  IconSquareRoundedPlus,
  IconTrashX,
} from '@tabler/icons-react'
import { useForm, zodResolver } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { DataTable } from 'mantine-datatable'
import { useState } from 'react'
import { IInvitation, InvitationSchema } from '@types'
import { ConfirmDelete } from '../core/confirm-delete'
import { datetime } from '@utils/datetime'

const PAGE_SIZE = 10

export const InvitationList = ({
  setSelected,
}: {
  invitation?: IInvitation
  setSelected: (val: IInvitation) => void
}) => {
  const { invitations, resend } = useInvitation()
  const [page, setPage] = useState(1)
  return (
    <Box maw={1200} h={invitations?.length < 5 ? 500 : 'auto'}>
      <DataTable
        striped
        withColumnBorders
        withBorder
        shadow="xs"
        totalRecords={invitations?.length}
        recordsPerPage={PAGE_SIZE}
        noRecordsText="No invitations found"
        page={page}
        onPageChange={(p) => setPage(p)}
        columns={[
          {
            accessor: 'actions',
            title: 'Actions',
            textAlignment: 'left',
            render: (invitation) => (
              <Group spacing={4} position="right" noWrap>
                <Tooltip label="Resend invitation" position="top">
                  <ActionIcon
                    color="green"
                    onClick={() => resend(invitation.id)}
                  >
                    <IconMessageForward size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete invitation" position="top">
                  <ActionIcon
                    color="red"
                    onClick={() => setSelected(invitation)}
                  >
                    <IconTrashX size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
          { title: 'Name', accessor: 'name', noWrap: true },
          { title: 'Email', accessor: 'email', noWrap: true },
          { title: 'Status', accessor: 'status', noWrap: true },
          {
            title: 'Registration Date',
            accessor: 'registrationDate',
            noWrap: true,
            render: (value) =>
              value?.registrationDate
                ? datetime(value.registrationDate).format('YYYY-MM-DD HH:mm')
                : 'Not registered yet',
          },
          {
            title: 'Invitation Date',
            accessor: 'createdAt',
            noWrap: true,
            render: (value) =>
              datetime(value.createdAt).format('YYYY-MM-DD HH:mm'),
          },
        ]}
        records={invitations}
      />
    </Box>
  )
}

const InvitationForm = ({ close }: { close: () => void }) => {
  const { add, sendLoading } = useInvitation()
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
    },
    validate: zodResolver(InvitationSchema),
  })
  const handleSubmit = async (values) => {
    await add(values)
    close()
  }
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack spacing="md">
        <TextInput
          label="Full name"
          placeholder="John Doe"
          description="The Firstname and Lastname of the person you want to invite"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          placeholder="john@gmail.com "
          description="The email of the person you want to invite"
          {...form.getInputProps('email')}
        />
        <Button type="submit" variant="outline" loading={sendLoading}>
          Send Invitation
        </Button>
      </Stack>
    </form>
  )
}
export const Invitation = () => {
  const [opened, { close, toggle }] = useDisclosure(false)
  const [deleteOpen, { close: closeDelete, toggle: toggleDelete }] =
    useDisclosure(false)
  const [selected, setSelected] = useState<IInvitation>()
  const { remove } = useInvitation()
  const handleDelete = async () => {
    await remove(selected.id)
  }
  const handleSelectDelete = (invitation) => {
    setSelected(invitation)
    toggleDelete()
  }
  return (
    <Box maw={1200}>
      <Group py="xs" position="apart" noWrap>
        <Text size="xs" color="gray">
          Invite your patients to the platform and manage your invitations.
        </Text>
        <Button
          variant="light"
          color="teal"
          onClick={toggle}
          rightIcon={<IconSquareRoundedPlus />}
        >
          New invitation
        </Button>
      </Group>
      <InvitationList setSelected={handleSelectDelete} />
      <Modal
        opened={opened}
        onClose={close}
        title="Invite patients to the platform"
        centered
      >
        <InvitationForm close={close} />
      </Modal>
      <ConfirmDelete
        show={deleteOpen}
        onClose={closeDelete}
        onDelete={handleDelete}
        title="Delete this invitation?"
        message={`Are you sure you want to delete the invitation to ${selected?.name}? `}
      />
    </Box>
  )
}
