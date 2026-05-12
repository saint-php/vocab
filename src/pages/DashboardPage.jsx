import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useExam } from '../contexts/ExamContext'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'
import { getTotalQuizzes, getBestScore, getAverageScore, getRecentHistory, getMasteredCount } from '../utils/statsHelper'
import { getStreakData, getStreakMessage } from '../utils/streakHelper'
import { getDailyWord } from '../utils/dailyWordHelper'
import vocabulary from '../data/vocabulary'

export default function DashboardPage() {
  const { selectedExam, clearExam } = useExam()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    bestScore: 0,
    averageScore: 0,
    masteredWords: 0,
    currentStreak: 0,
    longestStreak: 0,
    streakMessage: '',
    recentHistory: [],
  })
  const [dailyWord, setDailyWord] = useState(null)

  useEffect(() => {
    const streakData = getStreakData()
    setStats({
      totalQuizzes: getTotalQuizzes(),
      bestScore: getBestScore(),
      averageScore: getAverageScore(),
      masteredWords: getMasteredCount(),
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      streakMessage: getStreakMessage(),
      recentHistory: getRecentHistory(),
    })
    setDailyWord(getDailyWord(vocabulary))
  }, [])

  const handleInstall = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      alert('✅ App is already installed!')
      return
    }

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
    const isChrome = navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edg')
    const isEdge = navigator.userAgent.includes('Edg')

    if (isIOS) {
      alert('📱 iPhone Install:\n1. Tap Share button (⬆️)\n2. Scroll down\n3. Tap "Add to Home Screen"')
    } else if (isChrome || isEdge) {
      alert('💻 Chrome/Edge Install:\n1. Click ⋮ menu (top right)\n2. Select "Install app" or "Add to Home Screen"')
    } else {
      alert('Use your browser menu to install this app')
    }
  }

  const statCards = [
    { label: 'Quizzes Taken', value: stats.totalQuizzes, color: 'bg-purple-600' },
    { label: 'Best Score', value: stats.bestScore, color: 'bg-green-600' },
    { label: 'Average Score', value: stats.averageScore, color: 'bg-blue-600' },
    { label: 'Words Mastered', value: stats.masteredWords, color: 'bg-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {selectedExam && selectedExam !== 'All' && (
        <div className="bg-purple-100 border-b border-purple-200 px-6 py-3">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <span className="text-purple-700 font-semibold">
              📚 Focus: {selectedExam} Vocabulary
            </span>
            <button
              onClick={clearExam}
              className="text-purple-600 hover:text-purple-800 text-sm font-semibold"
            >
              Change Exam →
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">
          Your Dashboard
        </h1>
        <p className="text-gray-600 mb-10">{stats.streakMessage}</p>

        {dailyWord && (
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-lg p-6 mb-10 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm opacity-80 mb-1">📅 Word of the Day</p>
                <h2 className="text-3xl font-bold">{dailyWord.word}</h2>
              </div>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                {dailyWord.category}
              </span>
            </div>
            <p className="text-lg mb-2">{dailyWord.meaning}</p>
            <p className="italic opacity-90 mb-4">"{dailyWord.example}"</p>
            <div className="flex gap-4 text-sm opacity-80">
              <span>Synonym: {dailyWord.synonym}</span>
              <span>Antonym: {dailyWord.antonym}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {statCards.map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-2xl p-6 text-white`}>
              <p className="text-4xl font-bold mb-2">{stat.value}</p>
              <p className="text-sm opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Study Streak</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-purple-700">{stats.currentStreak}</p>
              <p className="text-sm text-gray-600">Current Streak</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-green-700">{stats.longestStreak}</p>
              <p className="text-sm text-gray-600">Longest Streak</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleInstall}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              📲 Install App
            </button>
            <Link
              to="/vocabulary"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              Browse Words
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

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Quiz History</h2>

          {stats.recentHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No quizzes taken yet.</p>
              <Link
                to="/quiz-setup"
                className="text-purple-600 hover:text-purple-800 font-semibold"
              >
                Take your first quiz →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentHistory.map((quiz, index) => {
                const percentage = Math.round((quiz.score / quiz.total) * 100)
                const date = new Date(quiz.date).toLocaleDateString()

                return (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        Quiz #{stats.totalQuizzes - index}
                        {quiz.category && quiz.category !== 'All' && (
                          <span className="text-purple-600 ml-2 text-sm">({quiz.category})</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-700">
                        {quiz.score}/{quiz.total}
                      </p>
                      <p className="text-sm text-gray-500">{percentage}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}