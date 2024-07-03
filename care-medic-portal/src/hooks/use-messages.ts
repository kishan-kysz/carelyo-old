import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteMessage,
  getMessagesByUser,
  sendMessageToUser,
  setMessageAsRead,
} from '@routes'
import useProfile from './use-profile'
import { showNotification } from '@mantine/notifications'
import { sortByLatestDate } from '@utils/helpers'
import { IFormValues } from '@types'

const useMessages = () => {
  const { user } = useProfile()
  const queryClient = useQueryClient()

  const {
    data,
    isLoading: loading,
    isError: error,
  } = useQuery(
    ['getMessagesByUser', user?.userId],
    () => getMessagesByUser(user?.userId),
    {
      select: (data) => {
        const remHtml = data.filter((item) => {
          return !item.message.includes('DOCTYPE')
        })
        return sortByLatestDate(remHtml)
      },
      enabled: user !== undefined,
    },
  )

  const { mutateAsync: mutateDeleteMsg, isLoading: deleteLoading } =
    useMutation((messageId: number) => deleteMessage(messageId), {
      onError: () => {
        showNotification({
          title: 'There has been an error',
          message: 'Contact support',
        })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['getMessagesByUser', user.userId],
        })
        showNotification({
          title: 'Messsage has been deleted',
          message: '',
        })
      },
    })

  const { mutateAsync: readMsg, isLoading: updateHasBeenReadLoader } =
    useMutation((messageId: number) => setMessageAsRead(messageId), {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['getMessagesByUser', user?.userId],
        })
      },
    })

  const { mutateAsync: sendMessage, isLoading: sendMessageToUserLoading } =
    useMutation((body: IFormValues) => sendMessageToUser(body), {
      onSuccess: () => {
        showNotification({
          title: 'Success',
          message: 'Your message has been sent successfully',
          color: 'Green',
        })
      },
      onError: () => {
        showNotification({
          color: 'red',
          title: 'Something went wrong',
          message: 'Please contact support or try again!',
        })
      },
    })
  return {
    loading,
    deleteLoading: deleteLoading,
    error: error,
    messages: data,
    mutateDeleteMsg,
    readMsg,
    updateHasBeenReadLoader,
    sendMessage,
    sendMessageToUserLoading,
  }
}

export default useMessages
