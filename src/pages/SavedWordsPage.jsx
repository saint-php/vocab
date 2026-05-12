import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import VocabularyCard from '../components/VocabularyCard'
import WordModal from '../components/WordModal'
import vocabulary from '../data/vocabulary'
import { getBookmarks, toggleBookmark } from '../utils/bookmarkHelper'

export default function SavedWordsPage() {
  const [bookmarks, setBookmarks] = useState(() => getBookmarks())
  const [selectedWord, setSelectedWord] = useState(null)

  const bookmarkedWords = vocabulary.filter((word) => bookmarks.includes(word.id))

  const openModal = (word) => setSelectedWord(word)
  const closeModal = () => setSelectedWord(null)

  const handleToggleBookmark = (wordId) => {
    const updated = toggleBookmark(wordId)
    setBookmarks(updated)
  }

  const isWordBookmarked = (wordId) => bookmarks.includes(wordId)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-purple-700">
            🔖 Saved Words
          </h1>

          <Link
            to="/vocabulary"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            ← Back to Vocabulary
          </Link>
        </div>

        {bookmarkedWords.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📑</p>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No saved words yet</h2>
            <p className="text-gray-500 mb-6">Bookmark words while browsing to save them here</p>
            <Link
              to="/vocabulary"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition"
            >
              Browse Vocabulary
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6">
              {bookmarkedWords.length} word{bookmarkedWords.length !== 1 ? 's' : ''} saved
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedWords.map((word) => (
                <VocabularyCard 
                  key={word.id} 
                  word={word} 
                  onClick={() => openModal(word)}
                  isBookmarked={isWordBookmarked(word.id)}
                  onToggleBookmark={handleToggleBookmark}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {selectedWord && (
        <WordModal
          word={selectedWord}
          onClose={closeModal}
          onMarkMastered={() => {}}
          isMastered={false}
        />
      )}
    </div>
  )
}