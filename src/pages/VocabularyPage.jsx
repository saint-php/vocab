import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useExam } from '../contexts/ExamContext'
import Navbar from '../components/Navbar'
import VocabularyCard from '../components/VocabularyCard'
import WordModal from '../components/WordModal'
import DictionarySearch from '../components/DictionarySearch'
import vocabulary from '../data/vocabulary'
import { recordStudySession } from '../utils/streakHelper'
import { getBookmarks, toggleBookmark } from '../utils/bookmarkHelper'

const CATEGORIES = ['All', 'UTME', 'WAEC', 'NECO', 'IELTS', 'TOEFL', 'SAT', 'GRE', 'Custom']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

export default function VocabularyPage() {
  const { selectedExam, clearExam } = useExam()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(selectedExam || 'All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedWord, setSelectedWord] = useState(null)
  const [masteredWords, setMasteredWords] = useState(() => {
    return JSON.parse(localStorage.getItem('masteredWords') || '[]')
  })
  const [bookmarks, setBookmarks] = useState(() => getBookmarks())
  const [customWords, setCustomWords] = useState(() => {
    return JSON.parse(localStorage.getItem('customWords') || '[]')
  })

  // Combine hardcoded + custom words
  const allWords = [...vocabulary, ...customWords]

  const filteredByCategory = selectedCategory === 'All'
    ? allWords
    : allWords.filter((word) => word.category === selectedCategory)

  const filteredByDifficulty = selectedDifficulty === 'All'
    ? filteredByCategory
    : filteredByCategory.filter((word) => word.difficulty === selectedDifficulty)

  const filteredVocabulary = filteredByDifficulty.filter((word) => {
    const term = searchTerm.toLowerCase()
    return (
      word.word.toLowerCase().includes(term) ||
      word.meaning.toLowerCase().includes(term) ||
      (word.synonym && word.synonym.toLowerCase().includes(term))
    )
  })

  const openModal = (word) => setSelectedWord(word)
  const closeModal = () => setSelectedWord(null)

  const toggleMastered = () => {
    if (!selectedWord) return
    const isMastered = masteredWords.includes(selectedWord.id)
    let updated

    if (isMastered) {
      updated = masteredWords.filter((id) => id !== selectedWord.id)
    } else {
      updated = [...masteredWords, selectedWord.id]
      recordStudySession()
    }

    setMasteredWords(updated)
    localStorage.setItem('masteredWords', JSON.stringify(updated))
  }

  const handleToggleBookmark = (wordId) => {
    const updated = toggleBookmark(wordId)
    setBookmarks(updated)
  }

  const handleAddCustomWord = (word) => {
    const newCustomWords = [...customWords, {
      id: Date.now(),
      ...word,
      difficulty: 'Medium',
      category: 'Custom',
    }]
    setCustomWords(newCustomWords)
    localStorage.setItem('customWords', JSON.stringify(newCustomWords))
    alert(`"${word.word}" added to your custom words!`)
  }

  const isWordMastered = (wordId) => masteredWords.includes(wordId)
  const isWordBookmarked = (wordId) => bookmarks.includes(wordId)

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {selectedExam && selectedExam !== 'All' && (
        <div className="bg-purple-100 border-b border-purple-200 px-6 py-3">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span className="text-purple-700 font-semibold">
              📚 Showing {selectedExam} words
            </span>
            <button
              onClick={() => {
                clearExam()
                setSelectedCategory('All')
              }}
              className="text-purple-600 hover:text-purple-800 text-sm font-semibold"
            >
              Show All Exams →
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-purple-700">
            Vocabulary Builder
          </h1>

          <div className="flex gap-3">
            <Link
              to="/saved-words"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              🔖 Saved Words
            </Link>
            <Link
              to="/flashcards"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Study Flashcards
            </Link>
            <Link
              to="/quiz-setup"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Take Quiz
            </Link>
          </div>
        </div>

        {/* Dictionary Search */}
        <DictionarySearch onAddWord={handleAddCustomWord} />

        <input
          type="text"
          placeholder="Search by word, meaning, or synonym..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">Category</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Difficulty</p>
          <div className="flex gap-2 flex-wrap">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  selectedDifficulty === difficulty
                    ? difficulty === 'Easy' ? 'bg-green-600 text-white'
                      : difficulty === 'Medium' ? 'bg-yellow-500 text-white'
                      : difficulty === 'Hard' ? 'bg-red-600 text-white'
                      : 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-500 mb-6">
          Showing {filteredVocabulary.length} word{filteredVocabulary.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {selectedDifficulty !== 'All' && ` • ${selectedDifficulty}`}
        </p>

        {filteredVocabulary.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No words found matching your filters</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVocabulary.map((word) => (
              <VocabularyCard 
                key={word.id} 
                word={word} 
                onClick={() => openModal(word)}
                isBookmarked={isWordBookmarked(word.id)}
                onToggleBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        )}
      </div>

      {selectedWord && (
        <WordModal
          word={selectedWord}
          onClose={closeModal}
          onMarkMastered={toggleMastered}
          isMastered={isWordMastered(selectedWord.id)}
        />
      )}
    </div>
  )
}