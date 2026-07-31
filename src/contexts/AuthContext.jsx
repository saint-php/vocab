import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function initialize() {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.user) {
      await fetchProfile(session.user)
    } else {
      setUser(null)
      setLoading(false)
    }
  }

  async function fetchProfile(authUser) {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle()

    if (error) {
      console.error(error)
    }

    if (data) {
      setUser(data)
    } else {
      // User exists in Auth but not in profile
      setUser({
        id: authUser.id,
        email: authUser.email,
        username: authUser.email.split('@')[0],
      })
    }

    setLoading(false)
  }

  async function signup(username, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error)
      return {
        success: false,
        error: error.message,
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
  }

  async function login(email, password) {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    await fetchProfile(data.user)

    return {
      success: true,
    }
  }

  async function logout() {
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
