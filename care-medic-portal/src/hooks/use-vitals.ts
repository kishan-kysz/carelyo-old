import { getChildVitals, getVitals } from '@routes'
import { useQuery } from '@tanstack/react-query'

const UseVitals = (patientId: number, isChild: Boolean) => {
  const { data: vitalData, isLoading } = useQuery(
    ['getVitals', patientId],
    () => isChild ? getChildVitals(patientId) : getVitals(patientId),
  )
  return { vitalData, loading: isLoading }
}

export default UseVitals
