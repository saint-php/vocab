import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profile')
      .select('*')
      .eq('id', userId)
      .single()
    
    setUser(data || null)
    setLoading(false)
  }

  const signup = async (username, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) return { success: false, error: error.message }

    // Create profile
    await supabase.from('profile').insert([
      { id: data.user.id, username, email }
    ])

    return { success: true }
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) return { success: false, error: error.message }

    return { success: true }
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
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}