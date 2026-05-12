import { useEffect } from 'react'

export default function WordModal({ word, onClose, onMarkMastered, isMastered }) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [])

  if (!word) return null

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Hard: 'bg-red-100 text-red-700',
  }

  const badgeColor = difficultyColors[word.difficulty] || 'bg-gray-100 text-gray-700'

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-bold mb-2">{word.word}</h2>
              <div className="flex gap-2">
                <span className={`${badgeColor} px-3 py-1 rounded-full text-sm font-semibold`}>
                  {word.difficulty}
                </span>
                <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                  {word.category}
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meaning */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Meaning
            </h3>
            <p className="text-xl text-gray-800">{word.meaning}</p>
          </div>

          {/* Example */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Example
            </h3>
            <p className="text-lg text-gray-700 italic">"{word.example}"</p>
          </div>

          {/* Synonym & Antonym */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-green-700 mb-1">Synonym</h3>
              <p className="text-lg font-medium text-gray-800">{word.synonym}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-red-700 mb-1">Antonym</h3>
              <p className="text-lg font-medium text-gray-800">{word.antonym}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onMarkMastered}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                isMastered
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isMastered ? '✓ Mastered' : 'Mark as Mastered'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}