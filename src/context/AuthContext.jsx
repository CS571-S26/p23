import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'ace_auth_session'

/** @returns {{ username: string, role: 'student' | 'mentor' } | null} */
function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (
      data &&
      typeof data.username === 'string' &&
      (data.role === 'student' || data.role === 'mentor')
    ) {
      return { username: data.username, role: data.role }
    }
  } catch {
    /* ignore corrupt storage */
  }
  return null
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser())

  const login = ({ username, role }) => {
    const next = { username, role }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setUser(next)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
