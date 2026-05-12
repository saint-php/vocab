import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import { generateQuiz } from '../utils/quizGenerator'
import { recordStudySession } from '../utils/streakHelper'
import { useAuth } from '../contexts/AuthContext'

export default function QuizPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const quizSettings = location.state || { category: 'All', difficulty: 'All', questionCount: 5 }

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    const quiz = generateQuiz(quizSettings.questionCount, quizSettings.category, quizSettings.difficulty)
    setQuestions(quiz)
  }, [quizSettings.category, quizSettings.difficulty, quizSettings.questionCount])

  const currentQuestion = questions[currentIndex]

  const handleSelectAnswer = (option) => {
    if (answered) return

    setSelectedAnswer(option)
    setAnswered(true)

    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      const finalScore = score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)
      setShowResult(true)
      saveScore(finalScore)
    }
  }

  const saveScore = async (finalScore) => {
    recordStudySession()

    if (user) {
      await supabase.from('quiz_results').insert([
        {
          user_id: user.id,
          score: finalScore,
          total: questions.length,
          category: quizSettings.category,
        }
      ])
    }

    const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]')
    quizHistory.push({
      date: new Date().toISOString(),
      score: finalScore,
      total: questions.length,
      category: quizSettings.category,
    })
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory))
  }

  const restartQuiz = () => {
    const quiz = generateQuiz(quizSettings.questionCount, quizSettings.category, quizSettings.difficulty)
    setQuestions(quiz)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setAnswered(false)
  }

  const goToSetup = () => {
    navigate('/quiz-setup')
  }

  // ... rest of component stays exactly the same
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-xl text-gray-600">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    let message = ''
    if (percentage >= 80) message = 'Excellent! 🎉'
    else if (percentage >= 60) message = 'Good job! 👍'
    else if (percentage >= 40) message = 'Keep practicing! 💪'
    else message = 'Don\'t give up! 📚'

    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="max-w-2xl mx-auto px-6 py-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                       <p className="text-sm text-gray-500 mb-2">
              {quizSettings.category} • {quizSettings.difficulty !== 'All' ? `${quizSettings.difficulty} • ` : ''}{questions.length} Questions
            </p>
            <p className="text-6xl font-bold text-purple-600 mb-4">
              {score} / {questions.length}
            </p>
            <p className="text-2xl text-gray-700 mb-2">{message}</p>
            <p className="text-gray-500">{percentage}% correct</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={restartQuiz}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition w-full max-w-md"
            >
              Try Again
            </button>

            <button
              onClick={goToSetup}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-xl text-lg font-semibold transition w-full max-w-md"
            >
              New Quiz Settings
            </button>

            <div>
              <Link
                to="/vocabulary"
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                ← Back to Vocabulary
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
               <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <span>
            {quizSettings.category} Quiz
            {quizSettings.difficulty !== 'All' && ` • ${quizSettings.difficulty}`}
          </span>
          <span>{questions.length} questions</span>
        </div>
        <div className="flex justify-between items-center mb-8">
          <span className="text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="text-purple-600 font-semibold">
            Score: {score}
          </span>
        </div>

        <div className="w-full bg-gray-300 rounded-full h-2 mb-8">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            What is the meaning of:
          </h2>
          <p className="text-4xl font-bold text-purple-700 mb-8">
            {currentQuestion.word}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = 'w-full text-left px-6 py-4 rounded-xl border-2 transition font-medium '

              if (!answered) {
                buttonClass += 'border-gray-200 hover:border-purple-400 hover:bg-purple-50'
              } else if (option === currentQuestion.correctAnswer) {
                buttonClass += 'border-green-500 bg-green-50 text-green-700'
              } else if (option === selectedAnswer) {
                buttonClass += 'border-red-500 bg-red-50 text-red-700'
              } else {
                buttonClass += 'border-gray-200 opacity-50'
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  className={buttonClass}
                  disabled={answered}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        {answered && (
          <button
            onClick={handleNext}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl font-semibold transition"
          >
            {currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}