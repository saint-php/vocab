import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Get Session Error:', error)
          if (mounted) setLoading(false)
          return
        }

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
        }
      } catch (err) {
        console.error(err)
        if (mounted) setLoading(false)
      }
    }

    initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AUTH EVENT:', event)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId) => {
    try {
      console.log('Loading profile for:', userId)

      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('Profile Fetch Error:', error)
        setUser(null)
        setLoading(false)
        return
      }

      if (!data) {
        console.warn('No profile found.')

        setUser(null)
        setLoading(false)
        return
      }

      console.log('Profile Loaded:', data)

      setUser(data)
      setLoading(false)
    } catch (err) {
      console.error('Fetch Profile Exception:', err)
      setUser(null)
      setLoading(false)
    }
  }

  const signup = async (username, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error(error)
        return {
          success: false,
          error: error.message,
        }
      }

      if (!data.user) {
        return {
          success: false,
          error: 'User was not created.',
        }
      }

      const { error: profileError } = await supabase
        .from('profile')
        .insert([
          {
            id: data.user.id,
            username,
            email,
          },
        ])

      if (profileError) {
        console.error(profileError)

        return {
          success: false,
          error: profileError.message,
        }
      }

      return {
        success: true,
      }
    } catch (err) {
      console.error(err)

      return {
        success: false,
        error: err.message,
      }
    }
  }

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('LOGIN DATA:', data)
      console.log('LOGIN ERROR:', error)

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      if (data.user) {
        await fetchProfile(data.user.id)
      }

      return {
        success: true,
      }
    } catch (err) {
      console.error(err)

      return {
        success: false,
        error: err.message,
      }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const isAuthenticated = !!user

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-600 flex items-center justify-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
