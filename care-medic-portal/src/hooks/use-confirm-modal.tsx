import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { IconSlash, IconCheck } from '@tabler/icons-react'

const ConfirmModal = ({
  showConfirmModal,
  setShowConfirmModal,
  callback,
  loading,
}: {
  showConfirmModal: boolean
  setShowConfirmModal: Dispatch<SetStateAction<boolean>>
  callback?: Function
  loading?: boolean
}) => {
  const handleConfirm = async () => {
    await callback()
    if (!loading) {
      setShowConfirmModal(false)
    }
  }

  return (
    <Modal
      opened={showConfirmModal}
      onClose={() => setShowConfirmModal(false)}
      centered={true}
    >
      <Stack>
        <Title order={4}>Complete?</Title>
        <Text size="md">
          {' '}
          Are you sure the information you are providing is valid?
          <Text color="gray">
            Your profile will be updated with the provide information and you
            will not be able to change it later.
          </Text>
        </Text>
        <Text>
          Press{' '}
          <Text weight={800} span={true} color="green">
            confirm
          </Text>{' '}
          to continue or{' '}
          <Text weight={800} span={true} color="yellow">
            cancel
          </Text>{' '}
          to go back and control
        </Text>
        <Group position="apart">
          <Button
            leftIcon={<IconSlash />}
            variant="outline"
            color="yellow"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            leftIcon={<IconCheck />}
            onClick={handleConfirm}
            variant="outline"
          >
            Confirm
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
const useConfirmModal = (callback?: Function) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const SignInModalCallback = useCallback(
    ({ isLoading }) => {
      return (
        <ConfirmModal
          showConfirmModal={showConfirmModal}
          setShowConfirmModal={setShowConfirmModal}
          callback={callback}
          loading={isLoading}
        />
      )
    },
    [showConfirmModal, callback],
  )

  return useMemo(
    () => ({
      showConfirmModal: setShowConfirmModal,
      ConfirmModal: SignInModalCallback,
    }),
    [setShowConfirmModal, SignInModalCallback],
  )
}

export default useConfirmModal
