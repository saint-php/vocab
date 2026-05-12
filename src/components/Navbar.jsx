import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MobileNavbar from './MobileNavbar'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center relative">
      <Link to={isAuthenticated ? '/dashboard' : '/'} className="text-2xl font-bold hover:text-gray-200">
        Vocab Builder
      </Link>

      <div className="hidden md:flex gap-4 items-center">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-gray-200">
              Dashboard
            </Link>
            <Link to="/vocabulary" className="hover:text-gray-200">
              Vocabulary
            </Link>
            <Link to="/saved-words" className="hover:text-gray-200">
              Saved
            </Link>
            <Link to="/flashcards" className="hover:text-gray-200">
              Flashcards
            </Link>
            <Link to="/quiz-setup" className="hover:text-gray-200">
              Quiz
            </Link>
            <span className="text-sm opacity-80">
              Hi, {user?.username || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-200">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Signup
            </Link>
          </>
        )}
      </div>

      <MobileNavbar />
    </nav>
  )
}