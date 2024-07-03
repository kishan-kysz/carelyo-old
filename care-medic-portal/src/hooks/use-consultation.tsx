import { hideNotification, showNotification } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStateMachine } from 'little-state-machine'
import { useRouter } from 'next/router'
import {
  acceptConsultation,
  cancelConsultation,
  finishConsultation,
  getBookedConsultations,
  startConsultation,
} from '@routes'
import { resetSbar, setActiveConsultation } from '@utils/actions'
import useProfile from './use-profile'
import { ConfirmError } from '@components/core/confirm-error'
import { isEmptyObject } from 'is-what'

const useConsultation = () => {
  const router = useRouter()
  const { user } = useProfile()
  const queryClient = useQueryClient()
  const activeConsultation = isEmptyObject(user?.activeConsultation)
    ? null
    : user?.activeConsultation
  const { data, error, isLoading } = useQuery(
    ['bookedConsultations'],
    () => getBookedConsultations(),
    {
      enabled: !!user,
    },
  )
  const { actions } = useStateMachine({
    setActiveConsultation,
    resetSbar,
  })

  const formatErrorMessage = `You have an active or incomplete consultation with ${activeConsultation?.patientName}`
  const handleErrorAction = () => {
    void router.push({
      pathname: '/consultation/[id]',
      query: { id: activeConsultation.roomName },
    })
    hideNotification('accept-consultation-error')
  }

  const { mutateAsync: accept } = useMutation(acceptConsultation, {
    onError: (err) => {
      showNotification({
        id: 'accept-consultation-error',
        autoClose: false,
        color: 'red',
        title: 'Failed to accept consultation',
        message:
          activeConsultation !== null ? (
            <ConfirmError
              error={formatErrorMessage}
              action={handleErrorAction}
              actionText="View consultation"
            />
          ) : (
            // @ts-ignore
            err.response.data.errors[0].message
          ),
      })
    },
    onSuccess: (data) => {
      actions.setActiveConsultation(true)
      void router.push({
        pathname: '/consultation/[id]',
        query: { id: data.roomName },
      })
    },
    onSettled: () => {
      void queryClient.invalidateQueries(['bookedConsultations'])
    },
  })

  const { mutateAsync: start } = useMutation(startConsultation, {
    onError: (err) => {
      showNotification({
        title: 'Failed to start consultation',
        // @ts-ignore
        message: err.response.data.errors[0].message,
      })
      void queryClient.invalidateQueries(['bookedConsultations'])
      void router.push('/')
    },
    onSuccess: (data) => {
      showNotification({
        message: data.message,
      })
    },
  })

  const { mutateAsync: finish, isLoading: finishLoading } = useMutation(
    finishConsultation,
    {
      onError: () => {
        showNotification({
          title: 'Something went wrong!',
          message: 'Failed to finish consultation',
          color: 'red',
        })
      },
      onSuccess: () => {
        showNotification({
          message: 'consultation completed',
        })
        actions.setActiveConsultation(false)
        actions.resetSbar()
        void router.push('/')
        void queryClient.invalidateQueries(['bookedConsultations'])
      },
    },
  )

  const { mutateAsync: cancel } = useMutation(cancelConsultation, {
    onError: () => {
      showNotification({
        title: 'Failed to cancel consultation',
        // @ts-ignore
        message: err.response.data.errors[0].message,
      })
    },
    onSuccess: () => {
      showNotification({
        message: 'consultation cancelled',
      })
      actions.setActiveConsultation(false)
      actions.resetSbar()
      void router.push('/')
      void queryClient.invalidateQueries(['bookedConsultations'])
    },
  })

  return {
    data,
    error,
    activeConsultation,
    accept,
    isLoading,
    start,
    cancel,
    finish,
    finishLoading,
  }
}

export default useConsultation
