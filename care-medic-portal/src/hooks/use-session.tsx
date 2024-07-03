import { createContext, useCallback, useContext, useEffect } from 'react'
import { getSession, removeSession } from '@utils/auth'
import { useSessionStorage } from '@mantine/hooks'
import { LOGIN_URL } from '@utils/env'

type AuthContextType = {
  user: {
    userId: string
    token: string
  }
  logout: () => void
}

const AuthContext = createContext<AuthContextType>(undefined)

// checks if the object keys have values and is not null or undefined
const hasValues = (obj) => {
  const hasKeys = Object.keys(obj).length > 0
  const hasValues = Object.values(obj).every(
    (val) => val !== null && val !== undefined,
  )
  const hasToken = obj.token !== null && obj.token !== undefined
  const hasUserId = obj.userId !== null && obj.userId !== undefined
  return hasValues && hasKeys && hasToken && hasUserId
}
export const SessionProvider = ({ children }) => {
  const [user, setUser] = useSessionStorage({
    key: 'user',
    defaultValue: undefined,
  })
  const session = getSession()
  const logout = useCallback(() => {
    setUser(undefined)
    removeSession()
    window.location.replace(LOGIN_URL)
  }, [setUser])

  useEffect(() => {
    if (!user && session && !hasValues(session)) {
      logout()
    }
    if (!user && hasValues(session)) {
      setUser(session)
    }
  }, [logout, session, setUser, user])
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useSession must be used within AuthProvider')
  }

  return context
}
