import { showNotification } from '@mantine/notifications'
import { getAllPatients } from '@routes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export default function usePatient() {
  const [loading, setLoading] = useState(false)

  const { data: patientList, isLoading: loadingPatients } = useQuery(
    ['getAllPatients'],
    getAllPatients,
    {
      onSuccess: () => {},
      onError: (err: Error) => {
        showNotification({
          color: 'red',
          title: 'Unexpected error',
          message: err.message,
        })
      },
      select: (data) => {
        const removeIncompletePatient = data.filter((item) => {
          return item.firstName !== null
        })
        return removeIncompletePatient
      },
      enabled: true,
    },
  )

  useEffect(() => {
    if (loadingPatients) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [loadingPatients])
  return {
    loading,
    patientList,
  }
}
