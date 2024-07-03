import { useMutation } from '@tanstack/react-query'
import { createFollowUp, deleteFollowUp, editFollowUp } from '@routes'
import { showNotification } from '@mantine/notifications'

const useFollowup = () => {
  const { mutateAsync: create, isLoading: isLoadingCreate } = useMutation(
    createFollowUp,
    {
      onError: (error) => {
        showNotification({
          title: 'Error',
          color: 'red',
          message:
            // @ts-ignore
            error.response.data.errors[0].message || 'Something went wrong',
        })
      },
    },
  )
  const { mutateAsync: cancel, isLoading: isLoadingDel } = useMutation(
    deleteFollowUp,
    {
      onError: (error) => {
        showNotification({
          title: 'Error',
          color: 'red',
          message:
            // @ts-ignore
            error.response.data.errors[0].message || 'Something went wrong',
        })
      },
    },
  )
  const { mutateAsync: edit, isLoading: isLoadingEdit } = useMutation(
    editFollowUp,
    {
      onError: (error) => {
        showNotification({
          title: 'Error',
          color: 'red',
          message:
            // @ts-ignore
            error.response.data.errors[0].message || 'Something went wrong',
        })
      },
    },
  )

  return { create, cancel, edit, isLoadingCreate, isLoadingDel, isLoadingEdit }
}

export default useFollowup
