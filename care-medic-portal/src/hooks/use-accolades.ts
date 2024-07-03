import { getAuthenticatedUser } from '@utils/auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addAccolade,
  deleteAccolade,
  editAccolade,
  getAccolades,
} from '@routes'
import { IAccolade } from '@types'

const useAccolades = () => {
  const loggedInUser = getAuthenticatedUser()
  const queryClient = useQueryClient()
  const { data: accolades } = useQuery(
    ['accolades', loggedInUser.userId],
    () => getAccolades(parseInt(loggedInUser.userId)),
    {
      enabled: !!loggedInUser,
    },
  )
  const { mutateAsync: add, isLoading: addLoading } = useMutation(
    (input: { name: IAccolade['name']; description: string; year: number }) =>
      addAccolade({
        doctorId: parseInt(loggedInUser.userId),
        ...input,
      }),
    {
      onSuccess: async (data) => {
        queryClient.setQueryData(
          ['accolades', loggedInUser.userId],
          (prev: typeof accolades) => [...prev, data],
        )
      },
    },
  )
  const { mutateAsync: remove, isLoading } = useMutation(deleteAccolade, {
    onSuccess: async (data, variables) => {
      queryClient.setQueryData(
        ['accolades', loggedInUser.userId],
        (prev: typeof accolades) =>
          prev.filter((item) => item.id !== variables),
      )
    },
  })
  const { mutateAsync: update, isLoading: updateLoading } = useMutation(
    editAccolade,
    {
      onSuccess: async (data, variables) => {
        queryClient.setQueryData(
          ['accolades', loggedInUser.userId],
          (prev: typeof accolades) =>
            prev.map((item) => (item.id === variables.id ? data : item)),
        )
      },
    },
  )

  return {
    accolades,
    add,
    remove,
    update,
    delLoading: isLoading,
    addLoading,
    updateLoading,
  }
}

export default useAccolades
