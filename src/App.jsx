import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import InstallPrompt from './components/InstallPrompt'
import UpdatePrompt from './components/UpdatePrompt'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import VocabularyPage from './pages/VocabularyPage'
import FlashcardPage from './pages/FlashcardPage'
import QuizSetupPage from './pages/QuizSetupPage'
import QuizPage from './pages/QuizPage'
import SavedWordsPage from './pages/SavedWordsPage'


export default function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes - require login */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/vocabulary" element={
          <ProtectedRoute>
            <VocabularyPage />
          </ProtectedRoute>
        } />
        <Route path="/flashcards" element={
          <ProtectedRoute>
            <FlashcardPage />
          </ProtectedRoute>
        } />
        <Route path="/quiz-setup" element={
          <ProtectedRoute>
            <QuizSetupPage />
          </ProtectedRoute>
        } />
        <Route path="/quiz" element={
          <ProtectedRoute>
            <QuizPage />
          </ProtectedRoute>
        } />
        <Route path="/saved-words" element={
          <ProtectedRoute>
            <SavedWordsPage />
          </ProtectedRoute>
        } />
      </Routes>
      <InstallPrompt />
      <UpdatePrompt />
    </>
  )
}
