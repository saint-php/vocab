import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ----------------------------------------
  // Fetch or create profile
  // ----------------------------------------
  const fetchProfile = async (user) => {
    if (!user) {
      setProfile(null)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        console.error('Profile Fetch Error:', error)
        return
      }

      if (data) {
        setProfile(data)
        return
      }

      console.log('Profile not found. Creating...')

      const username =
        user.user_metadata?.username ||
        user.email?.split('@')[0] ||
        'User'

      const { data: newProfile, error: insertError } = await supabase
        .from('profile')
        .insert([
          {
            id: user.id,
            username,
            email: user.email,
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error('Profile Creation Error:', insertError)
        return
      }

      setProfile(newProfile)
    } catch (err) {
      console.error(err)
    }
  }

  // ----------------------------------------
  // Initialise auth
  // ----------------------------------------
  useEffect(() => {
    const initialise = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setAuthUser(session.user)
        await fetchProfile(session.user)
      }

      setLoading(false)
    }

    initialise()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('AUTH EVENT:', _event)

      if (session?.user) {
        setAuthUser(session.user)
        await fetchProfile(session.user)
      } else {
        setAuthUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ----------------------------------------
  // Signup
  // ----------------------------------------
  const signup = async (username, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (error) {
        return {
          success: false,
          error: error.message,
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

  // ----------------------------------------
  // Login
  // ----------------------------------------
  const login = async (email, password) => {
    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
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
        setAuthUser(data.user)
        await fetchProfile(data.user)
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

  // ----------------------------------------
  // Logout
  // ----------------------------------------
  const logout = async () => {
    await supabase.auth.signOut()

    setAuthUser(null)
    setProfile(null)
  }

  const isAuthenticated = !!authUser

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-600">
        <p className="text-white text-xl">Loading...</p>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user: profile,
        authUser,
        signup,
        login,
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
