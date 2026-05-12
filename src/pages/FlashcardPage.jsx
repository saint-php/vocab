import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import vocabulary from '../data/vocabulary'
import { recordStudySession } from '../utils/streakHelper'

export default function FlashcardPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredWords, setMasteredWords] = useState(() => {
    return JSON.parse(localStorage.getItem('masteredWords') || '[]')
  })
  const navigate = useNavigate()

  const currentWord = vocabulary[currentIndex]
  const isMastered = masteredWords.includes(currentWord.id)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setIsFlipped(false)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const toggleMastered = () => {
    let updated
    if (isMastered) {
      updated = masteredWords.filter((id) => id !== currentWord.id)
    } else {
      updated = [...masteredWords, currentWord.id]
      recordStudySession()
    }
    setMasteredWords(updated)
    localStorage.setItem('masteredWords', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700">Flashcards</h1>
          <span className="text-gray-600">
            {currentIndex + 1} / {vocabulary.length}
          </span>
        </div>

        <div
          onClick={handleFlip}
          className="bg-white rounded-2xl shadow-lg p-12 min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition text-center relative"
        >
          {!isFlipped ? (
            <div>
              <h2 className="text-4xl font-bold text-purple-700 mb-4">
                {currentWord.word}
              </h2>
              <p className="text-gray-500 text-sm">Tap to reveal meaning</p>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-purple-700 mb-4">
                {currentWord.meaning}
              </h3>
              <p className="text-gray-600 italic mb-4">
                "{currentWord.example}"
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Synonym:</span> {currentWord.synonym}</p>
                <p><span className="font-semibold">Antonym:</span> {currentWord.antonym}</p>
              </div>
            </div>
          )}

          {isMastered && (
            <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              ✓ Mastered
            </div>
          )}
        </div>

        <div className="text-center mt-4">
          <button
            onClick={toggleMastered}
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              isMastered
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isMastered ? 'Remove from Mastered' : 'Mark as Mastered'}
          </button>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === vocabulary.length - 1}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Next
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/vocabulary')}
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            ← Back to Vocabulary List
          </button>
        </div>
      </div>
    </div>
  )
}