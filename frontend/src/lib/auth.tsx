'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatar: string
  rating: number
  reviewCount: number
  verificationLevel: string
  joinedAt: string
  listings: number
  sales: number
  purchases: number
}

const MOCK_USER: AuthUser = {
  id: 'me',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  avatar: 'https://i.pravatar.cc/150?img=5',
  rating: 4.8,
  reviewCount: 12,
  verificationLevel: 'phone',
  joinedAt: '2024-01-15',
  listings: 3,
  sales: 5,
  purchases: 8,
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bicimarket_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (_email: string) => {
    localStorage.setItem('bicimarket_user', JSON.stringify(MOCK_USER))
    setUser(MOCK_USER)
  }

  const logout = () => {
    localStorage.removeItem('bicimarket_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
