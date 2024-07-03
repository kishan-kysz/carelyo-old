import {
  createInvitation,
  deleteInvitation,
  getInvitations,
  resendInvitation,
} from '@routes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAuthenticatedUser } from '@utils/auth'
import { showNotification } from '@mantine/notifications'

export default function useInvitations() {
  const loggedInUser = getAuthenticatedUser()

  const queryClient = useQueryClient()

  const { data: invitations } = useQuery(
    ['invitations', loggedInUser.userId],
    () => getInvitations(loggedInUser.userId),
    {
      enabled: !!loggedInUser,
    },
  )
  const { mutateAsync: add, isLoading: sendLoading } = useMutation(
    createInvitation,
    {
      onSuccess: async (data) => {
        showNotification({
          title: 'Success',
          message: `Invitation sent to ${data.email}`,
        })
        queryClient.setQueryData(
          ['invitations', loggedInUser.userId],
          (prev: typeof invitations) => [...prev, data],
        )
      },
      onError: async (error) => {
        showNotification({
          title: 'Error',
          message:
            'Invitation not sent, Make sure the email is correct and try again',
          color: 'red',
        })
      },
    },
  )
  const { mutateAsync: resend } = useMutation(resendInvitation, {
    onSuccess: async () => {
      showNotification({
        title: 'Success',
        message: 'Invitation delivered',
        color: 'yellow',
      })
    },
    onError: async (error) => {
      showNotification({
        title: 'Error',
        message: 'Could not resend invitation, please try again later',
        color: 'red',
      })
    },
  })
  const { mutateAsync: remove } = useMutation(deleteInvitation, {
    onSuccess: async (data, variables) => {
      showNotification({
        title: 'Success',
        message: 'Invitation permanently deleted',
        color: 'orange',
      })
      queryClient.setQueryData(
        ['invitations', loggedInUser.userId],
        (prev: typeof invitations) =>
          prev.filter((item) => item.id !== variables),
      )
    },
    onError: async (error) => {
      showNotification({
        title: 'Error',
        color: 'red',
        message: 'Could not delete invitation, please try again later',
      })
    },
  })
  return { invitations, add, sendLoading, resend, remove }
}
