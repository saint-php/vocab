import { useState, useEffect } from 'react'

export default function UpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false)

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker activated
        setNeedRefresh(true)
      })
    }
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  if (!needRefresh) return null

  return (
    <div className="fixed top-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-2xl shadow-lg z-50 max-w-md mx-auto flex justify-between items-center">
      <div>
        <p className="font-semibold">🔄 New version available!</p>
        <p className="text-sm opacity-90">Refresh to get the latest features</p>
      </div>
      <button
        onClick={handleRefresh}
        className="bg-white text-blue-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-100"
      >
        Refresh
      </button>
    </div>
  )
}