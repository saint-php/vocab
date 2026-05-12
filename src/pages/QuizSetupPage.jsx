import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExam } from '../contexts/ExamContext'
import Navbar from '../components/Navbar'

const CATEGORIES = ['All', 'UTME', 'WAEC', 'NECO', 'IELTS', 'TOEFL', 'SAT', 'GRE']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']
const QUESTION_COUNTS = [5, 10, 15, 20]

export default function QuizSetupPage() {
  const { selectedExam } = useExam()
  const [selectedCategory, setSelectedCategory] = useState(selectedExam || 'All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [questionCount, setQuestionCount] = useState(5)
  const navigate = useNavigate()

  const startQuiz = () => {
    navigate('/quiz', {
      state: {
        category: selectedCategory,
        difficulty: selectedDifficulty,
        questionCount: questionCount,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Exam Focus */}
      {selectedExam && selectedExam !== 'All' && (
        <div className="bg-purple-100 border-b border-purple-200 px-6 py-3">
          <div className="max-w-2xl mx-auto">
            <span className="text-purple-700 font-semibold text-sm">
              📚 Quiz will focus on {selectedExam} words
            </span>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-purple-700 mb-2 text-center">
          Quiz Setup
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Choose your preferred settings
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-3 rounded-xl font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-purple-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Difficulty</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-4 py-3 rounded-xl font-semibold transition ${
                  selectedDifficulty === difficulty
                    ? difficulty === 'Easy' ? 'bg-green-600 text-white'
                      : difficulty === 'Medium' ? 'bg-yellow-500 text-white'
                      : difficulty === 'Hard' ? 'bg-red-600 text-white'
                      : 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Number of Questions</h2>
          <div className="flex gap-3 flex-wrap">
            {QUESTION_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  questionCount === count
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
        >
          Start Quiz
        </button>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/vocabulary')}
            className="text-purple-600 hover:text-purple-800 font-semibold"
          >
            ← Back to Vocabulary
          </button>
        </div>
      </div>
    </div>
  )
}