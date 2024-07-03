import { showNotification } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCalendarEvent,
  deleteCalendarEvent,
  editCalendarEvent,
  getCalendarEvents,
} from '@routes'

export default function useCalendar() {
  const { data, isLoading: loadingEntries } = useQuery(
    ['getEvents'],
    getCalendarEvents,
    {
      onError: (err) => {
        showNotification({
          title: "Couldn't fetch events",
          message:
            // @ts-ignore
            err.response?.data?.errors[0]?.message || 'Something went wrong',
          color: 'red',
        })
      },
      select: (res) =>
        // @ts-ignore
        res.map((entry) => {
          // @ts-ignore
          const { start, end, ...rest } = entry
          return {
            ...rest,
            start: new Date(start),
            end: new Date(end),
          }
        }),
      retry: 2,
      staleTime: 1000 * 60 * 60 * 24,
    },
  )
  const queryClient = useQueryClient()
  const createEntry = useMutation(createCalendarEvent, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['getEvents'])
      showNotification({
        title: 'Success!',
        message: 'New Entry has been created.',
      })
    },
  })
  const deleteEntry = useMutation(deleteCalendarEvent, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['getEvents'])
      showNotification({
        title: 'Success!',
        message: ' Entry has been Deleted.',
      })
    },
  })
  const updateEntry = useMutation(editCalendarEvent, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['getEvents'])
      showNotification({
        title: 'Success!',
        message: ' Entry has been Updated.',
      })
    },
  })
  const isLoading =
    loadingEntries ||
    createEntry.isLoading ||
    deleteEntry.isLoading ||
    updateEntry.isLoading

  return {
    entries: data,
    isLoading,
    createEntry: createEntry.mutateAsync,
    deleteEntry: deleteEntry.mutateAsync,
    updateEntry: updateEntry.mutateAsync,
  }
}
