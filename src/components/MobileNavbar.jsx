import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    closeMenu()
  }

  const publicLinks = [
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Signup' },
  ]

  const authLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/vocabulary', label: 'Vocabulary' },
    { to: '/saved-words', label: 'Saved' },
    { to: '/flashcards', label: 'Flashcards' },
    { to: '/quiz-setup', label: 'Quiz' },
  ]

  const navLinks = isAuthenticated ? authLinks : publicLinks

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="text-white p-2 focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-purple-700 shadow-lg z-50">
          <div className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={closeMenu}
                className="text-white hover:text-gray-200 py-2"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <div className="border-t border-purple-600 pt-2">
                  <p className="text-sm text-purple-200">Hi, {user?.username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}