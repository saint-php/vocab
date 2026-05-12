import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useExam } from '../contexts/ExamContext'

const EXAMS = [
  { name: 'UTME', color: 'bg-blue-600 hover:bg-blue-700', description: 'Joint Admissions & Matriculation Board' },
  { name: 'WAEC', color: 'bg-green-600 hover:bg-green-700', description: 'West African Examinations Council' },
  { name: 'NECO', color: 'bg-orange-600 hover:bg-orange-700', description: 'National Examinations Council' },
  { name: 'IELTS', color: 'bg-purple-600 hover:bg-purple-700', description: 'International English Language Testing' },
  { name: 'TOEFL', color: 'bg-red-600 hover:bg-red-700', description: 'Test of English as Foreign Language' },
  { name: 'SAT', color: 'bg-indigo-600 hover:bg-indigo-700', description: 'Scholastic Assessment Test' },
  { name: 'GRE', color: 'bg-pink-600 hover:bg-pink-700', description: 'Graduate Record Examination' },
  { name: 'All', color: 'bg-gray-700 hover:bg-gray-800', description: 'General vocabulary practice' },
]

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const { selectExam } = useExam()
  const navigate = useNavigate()

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleExamSelect = (examName) => {
    selectExam(examName)
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="bg-purple-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vocab Builder</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-white hover:text-gray-200 font-semibold"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-purple-700 mb-4">
          Master Your Exam Vocabulary
        </h1>
        <p className="text-gray-600 text-xl mb-4 max-w-2xl mx-auto">
          Select the exam you're preparing for. We'll focus everything — words, quizzes, and flashcards — on what you need.
        </p>
        <p className="text-purple-600 font-semibold mb-8">
          Login or sign up to get started
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {EXAMS.map((exam) => (
            <button
              key={exam.name}
              onClick={() => handleExamSelect(exam.name)}
              className={`${exam.color} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 text-left`}
            >
              <h2 className="text-2xl font-bold mb-2">{exam.name}</h2>
              <p className="text-sm opacity-90">{exam.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}