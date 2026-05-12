import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { setDeferredPrompt, clearDeferredPrompt, triggerInstall } from '../utils/installHelper'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const location = useLocation()

  const showOnPages = ['/', '/login', '/signup', '/dashboard']
  const shouldShowOnThisPage = showOnPages.includes(location.pathname)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    
    window.addEventListener('appinstalled', () => {
      clearDeferredPrompt()
      setShowPrompt(false)
      setIsInstalled(true)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    const result = await triggerInstall()
    if (result.success) {
      setShowPrompt(false)
    }
  }

  if (isInstalled || !showPrompt || !shouldShowOnThisPage) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-purple-600 text-white p-4 rounded-2xl shadow-lg flex justify-between items-center z-50 max-w-md mx-auto">
      <div>
        <p className="font-semibold">📲 Install Vocab Builder</p>
        <p className="text-sm opacity-90">Add to home screen for offline learning</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setShowPrompt(false)}
          className="px-3 py-2 text-sm opacity-80 hover:opacity-100"
        >
          Later
        </button>
        <button
          onClick={handleInstall}
          className="bg-white text-purple-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-100"
        >
          Install
        </button>
      </div>
    </div>
  )
}