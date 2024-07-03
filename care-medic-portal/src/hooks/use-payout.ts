import { showNotification } from '@mantine/notifications'
import { createBankDetails, getAllBanks } from '@routes'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const usePayout = () => {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const { data: bankData, isLoading: loadingBanks } = useQuery(
    ['getAllBanks'],
    () => getAllBanks(),
  )

  const { mutateAsync: addBankDetails, isLoading: addBanksLoading } =
    useMutation(['createBankDetails'], createBankDetails, {
      onSuccess: () => {
        showNotification({
          title: 'Success',
          message: 'Your bank details have been updated',
        })
      },
      onError: (err: Error) => {
        showNotification({
          title: 'Something went wrong please try again',
          message: err.message,
        })
      },
    })

  useEffect(() => {
    if (loadingBanks || addBanksLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [loadingBanks, addBanksLoading])

  return {
    bankData,
    addBankDetails,
    addBanksLoading,
  }
}

export default usePayout
