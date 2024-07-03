import { createTest, deleteTest, editTest, getAllTests } from '@routes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { showNotification } from '@mantine/notifications'

export const useTests = (close?: () => void) => {
  const { data } = useQuery(['getAllTests'], getAllTests)

  const flatData = useMemo(
    () =>
      data?.flatMap((item) =>
        item?.procedures?.map((procedure) => ({
          id: item.id,
          label: procedure,
          value: procedure,
          group: item.category,
        })),
      ),
    [data],
  )

  const categoryData = useMemo(
    () =>
      data?.map((item) => ({
        id: item.id,
        label: item.category,
        value: item.category,
      })),
    [data],
  )

  const queryClient = useQueryClient()

  const { mutateAsync: createTestMutation } = useMutation(createTest, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['getAllTests'])
      showNotification({
        title: 'Success!',
        message: 'Test created successfully',
      })
      close()
    },
    onError: (error): void => {
      showNotification({
        title: 'Error',
        color: 'red',

        message: `Something went wrong: ${
          // @ts-ignore
          error?.response?.data?.errors[0]?.message || ''
        } `,
      })
    },
  })

  const { mutateAsync: updateTest, isLoading: updateLoading } = useMutation(
    editTest,
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(['getAllTests'])
        showNotification({
          title: 'Success!',
          message: 'Test updated successfully',
        })
      },
      onError: (error): void => {
        showNotification({
          title: 'Error',
          color: 'red',

          message: `Something went wrong: ${
            // @ts-ignore
            error?.response?.data?.errors[0]?.message || ''
          } `,
        })
      },
    },
  )

  const { mutateAsync: deleteTestMutation, isLoading: deleteLoading } =
    useMutation(deleteTest, {
      onSuccess: () => {
        void queryClient.invalidateQueries(['getAllTests'])
        showNotification({
          title: 'Success!',
          message: 'Test deleted successfully',
        })
      },
      onError: (error): void => {
        showNotification({
          title: 'Error',
          color: 'red',

          message: `Something went wrong: ${
            // @ts-ignore
            error?.response?.data?.errors[0]?.message || ''
          }`,
        })
      },
    })

  return {
    createTestMutation,
    updateTest,
    deleteTestMutation,
    data,
    flatData,
    categoryData,
  }
}
