import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import PrimaryButton from '../components/PrimaryButton'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const result = await signup(username, email, password)

    if (!result.success) {
      setError(result.error)
      return
    }

    alert('Account created successfully. Please log in.')
    navigate('/login', { replace: true })
  }

  const handleInstall = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      alert('✅ App is already installed!')
      return
    }

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
    const isChrome =
      navigator.userAgent.includes('Chrome') &&
      !navigator.userAgent.includes('Edg')
    const isEdge = navigator.userAgent.includes('Edg')

    if (isIOS) {
      alert(
        '📱 iPhone Install:\n1. Tap Share button (⬆️)\n2. Scroll down\n3. Tap "Add to Home Screen"'
      )
    } else if (isChrome || isEdge) {
      alert(
        '💻 Chrome/Edge Install:\n1. Click ⋮ menu\n2. Select "Install app"'
      )
    } else {
      alert('Use your browser menu to install this app.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center py-20 px-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-purple-700 mb-2">
            Create Account
          </h1>

          <p className="text-gray-500 text-center mb-6">
            Start building your vocabulary today
          </p>

          <button
            onClick={handleInstall}
            className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            📲 Install App
          </button>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />

            <PrimaryButton text="Create Account" />
          </form>

          <p className="text-center mt-6 text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-600 font-semibold hover:text-purple-800"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
