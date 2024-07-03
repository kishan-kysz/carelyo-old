import { showNotification } from '@mantine/notifications'
import { getPatientPrescriptions } from '@routes'
import { useQuery } from '@tanstack/react-query'

const usePrescriptions = (patientId: number) => {
  const { data: patientPrescriptions, isLoading: loadingPrescriptions } =
    useQuery(
      ['getPatientPrescriptions', patientId],
      () => getPatientPrescriptions(patientId),
      {
        onError: () => {
          showNotification({
            title: 'Unexpected error occurred',
            color: 'red',
            message: 'Please contact support or try again',
          })
        },
        enabled: patientId !== undefined,
      },
    )

  return {
    patientPrescriptions,
    loadingPrescriptions,
  }
}

export default usePrescriptions
