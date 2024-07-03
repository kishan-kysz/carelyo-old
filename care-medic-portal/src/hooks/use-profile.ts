import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile, uploadAvatar } from '@routes'
import { useSession } from './use-session'
import { useStateMachine } from 'little-state-machine'
import { setActiveConsultation } from '@utils/actions'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { IProfile } from '@types'
import { showNotification } from '@mantine/notifications'
import { i } from 'next-usequerystate/dist/parsers-fd455cd5'

const hasValues = (obj) => Object.values(obj).some((x) => x !== null)

const useProfile = () => {
  const { user, logout } = useSession()
  const queryClient = useQueryClient()
  const { actions, state } = useStateMachine({
    setActiveConsultation,
  })
  const [profile, setProfile] = useState<IProfile>(null)
  const { data, isError, isLoading } = useQuery(
    ['profile', user?.userId],
    () => getProfile(parseInt(user?.userId)),
    {
      onSuccess: (data) => {
        setProfile(data)
        if (data && hasValues(data.activeConsultation)) {
          actions.setActiveConsultation(true)
        } else {
          actions.setActiveConsultation(false)
        }
      },
      onError: () => {
        logout()
      },
      enabled: !!user?.userId,
      retry: 0,
      refetchInterval: () =>
        state.hasActiveConsultation &&
        profile?.activeConsultation.roomName === null
          ? 1000
          : false,
    },
  )

  useEffect(() => {
    if (
      state.hasActiveConsultation &&
      profile?.activeConsultation.roomName === null &&
      isLoading
    ) {
      showNotification({
        id: 'consultation-creation',
        title: 'Consultation',
        message: 'Your consultation is being created, please wait...',
        color: 'blue',
        icon: '$',
        loading: isLoading,
      })
    }
  }, [
    isLoading,
    profile?.activeConsultation.roomName,
    state.hasActiveConsultation,
  ])

  const updateProfileMutation = useMutation(updateProfile, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['profile', user?.userId])
    },
  })

  const { mutateAsync: upload } = useMutation(uploadAvatar)
  const refetch = useCallback(
    (client) => client.invalidateQueries(['profile', user?.userId]),
    [user?.userId],
  )
  const addRoomname = useCallback(
    (client, roomName) =>
      client.setQueryData(['profile', user?.userId], {
        ...profile,
        acticeConsultation: {
          ...profile.activeConsultation,
          roomName: roomName,
        },
      }),
    [user?.userId, profile],
  )
  return useMemo(
    () => ({
      user: data,
      isLoading,
      userError: isError,
      upload,
      invalidate: refetch,
      updateProfileMutation,
      addRoomname,
    }),
    [
      addRoomname,
      data,
      isError,
      isLoading,
      refetch,
      updateProfileMutation,
      upload,
    ],
  )
}

export default useProfile
