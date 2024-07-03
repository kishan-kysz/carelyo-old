import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { showNotification } from '@mantine/notifications'
import {
  createLabMutation,
  editLabRequest,
  deleteLabRequest,
  getLabsForUser,
} from '@routes'

interface IHandleDelete {
  readonly open: () => void
  readonly close: () => void
  readonly toggle: () => void
}
interface IProps {
  handleDelete?: IHandleDelete
  patientId?: number
}

const useLabs = ({ patientId, handleDelete }: IProps) => {
  const queryClient = useQueryClient()

  const { data: userLabs, isLoading: loadingUserLabs } = useQuery(
    ['getLabsForUser', patientId],
    () => getLabsForUser(patientId),
    {
      onError: () => {
        showNotification({
          color: 'red',
          title: 'Unexpected error occured',
          message: 'Please contact support or try again',
        })
      },
      enabled: patientId !== undefined,
    },
  )

  const { mutateAsync: createLab, isLoading: isLoadingCreate } = useMutation(
    createLabMutation,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(['acceptedConsultation'])
        showNotification({
          title: 'Success!',
          message: 'Lab created successfully',
        })
      },
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
  const { mutateAsync: editLab, isLoading: isLoadingEdit } = useMutation(
    ['editLab'],
    editLabRequest,
    {
      onSuccess: (data) => {
        {
          showNotification({
            title: 'Success!',
            message: data.message,
          })
        }
      },
      onError: (error) => {
        showNotification({
          title: 'Error',
          color: 'red',
          message:
            // @ts-ignore
            error.response.data.errors[0].message || 'Something went wrong',
        })
      },
      onSettled: () => {
        queryClient
          .invalidateQueries(['acceptedConsultation'])
          .then(() => close())
      },
    },
  )
  const { mutateAsync: deleteLab, isLoading: isLoadingDelete } = useMutation(
    ['deleteLab'],
    deleteLabRequest,
    {
      onSuccess: (data) => {
        showNotification({
          title: 'Success!',
          message: data.message,
        })
      },

      onError: (error) => {
        showNotification({
          title: 'Error',
          color: 'red',
          message:
            // @ts-ignore
            error.response.data.errors[0].message || 'Something went wrong',
        })
      },
      onSettled: () => {
        queryClient
          .invalidateQueries(['acceptedConsultation'])
          .then(() => handleDelete.close())
      },
    },
  )

  return {
    deleteLab,
    createLab,
    editLab,
    isLoadingCreate,
    isLoadingEdit,
    isLoadingDelete,
    userLabs,
    loadingUserLabs,
  }
}

export default useLabs
