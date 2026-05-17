import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const resolveProfile = async (user) => {
    if (!user) return null

    let profile = await authService.getUserProfile(user.id)
    if (!profile) {
      profile = await authService.createUserProfile(user)
    }

    if (!profile) {
      profile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Voter',
        role: user.user_metadata?.role || 'voter',
      }
    }

    return profile
  }

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        setError(null)
        const user = await authService.getCurrentUser()
        if (user) {
          setUser(user)
          const profile = await resolveProfile(user)
          setProfile(profile)
        }
      } catch (err) {
        const message = err?.message || 'Authentication initialization failed'
        setError(message)
        console.warn('Auth initialization error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen to auth state changes
    const subscription = authService.onAuthStateChange(async (session) => {
      if (session) {
        setError(null)
        setUser(session.user)
        const profile = await resolveProfile(session.user)
        setProfile(profile)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const refreshAuth = async () => {
    setIsLoading(true)
    try {
      setError(null)
      const user = await authService.getCurrentUser()
      setUser(user)
      if (user) {
        const profile = await resolveProfile(user)
        setProfile(profile)
      } else {
        setProfile(null)
      }
    } catch (err) {
      const message = err?.message || 'Could not refresh session'
      setError(message)
      console.warn('Auth refresh error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    user,
    profile,
    isLoading,
    error,
    isAuthenticated: !!user,
    isVerified: !!user?.email_confirmed_at,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
