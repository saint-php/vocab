// Get quiz history from local storage
export function getQuizHistory() {
  return JSON.parse(localStorage.getItem('quizHistory') || '[]')
}

// Calculate total quizzes taken
export function getTotalQuizzes() {
  return getQuizHistory().length
}

// Calculate best score
export function getBestScore() {
  const history = getQuizHistory()
  if (history.length === 0) return 0
  return Math.max(...history.map((q) => q.score))
}

// Calculate average score
export function getAverageScore() {
  const history = getQuizHistory()
  if (history.length === 0) return 0
  const total = history.reduce((sum, q) => sum + q.score, 0)
  return Math.round((total / history.length) * 100) / 100
}

// Get recent quiz history (last 5)
export function getRecentHistory() {
  return getQuizHistory().slice(-5).reverse()
}

// Get mastered words count
export function getMasteredCount() {
  return JSON.parse(localStorage.getItem('masteredWords') || '[]').length
}