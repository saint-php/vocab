const STREAK_KEY = 'studyStreak'

// Get streak data from local storage
export function getStreakData() {
  return JSON.parse(localStorage.getItem(STREAK_KEY) || JSON.stringify({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    totalStudyDays: 0,
  }))
}

// Save streak data to local storage
function saveStreakData(data) {
  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
}

// Check if two dates are the same day
function isSameDay(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate()
}

// Check if date2 is exactly one day after date1
function isConsecutiveDay(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = d2.getTime() - d1.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

// Record that user studied today
export function recordStudySession() {
  const data = getStreakData()
  const today = new Date().toISOString()

  // First time ever
  if (!data.lastStudyDate) {
    const newData = {
      currentStreak: 1,
      longestStreak: 1,
      lastStudyDate: today,
      totalStudyDays: 1,
    }
    saveStreakData(newData)
    return newData
  }

  // Already studied today
  if (isSameDay(data.lastStudyDate, today)) {
    return data
  }

  // Studied yesterday - streak continues
  if (isConsecutiveDay(data.lastStudyDate, today)) {
    const newStreak = data.currentStreak + 1
    const newData = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, data.longestStreak),
      lastStudyDate: today,
      totalStudyDays: data.totalStudyDays + 1,
    }
    saveStreakData(newData)
    return newData
  }

  // Streak broken - more than one day missed
  const newData = {
    currentStreak: 1,
    longestStreak: data.longestStreak,
    lastStudyDate: today,
    totalStudyDays: data.totalStudyDays + 1,
  }
  saveStreakData(newData)
  return newData
}

// Get streak status message
export function getStreakMessage() {
  const data = getStreakData()
  if (data.currentStreak === 0) return 'Start your streak today!'
  if (data.currentStreak === 1) return '1 day streak! Keep going!'
  return `${data.currentStreak} day streak! 🔥`
}