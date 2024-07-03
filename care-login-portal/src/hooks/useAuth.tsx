import { getIdsFromCookies } from '../utils/api'

const useAuth = () => {
  const data = getIdsFromCookies()

  return {
    data
  }
}

export default useAuth
