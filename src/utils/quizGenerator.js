import vocabulary from '../data/vocabulary'

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5)
}

export function generateQuiz(questionCount = 5, category = 'All', difficulty = 'All') {
  // Filter by category
  let filteredWords = category === 'All'
    ? vocabulary
    : vocabulary.filter((word) => word.category === category)

  // Filter by difficulty
  if (difficulty !== 'All') {
    filteredWords = filteredWords.filter((word) => word.difficulty === difficulty)
  }

  // If not enough words, use all available
  const availableCount = Math.min(questionCount, filteredWords.length)
  
  const shuffled = shuffleArray(filteredWords)
  const selected = shuffled.slice(0, availableCount)

  return selected.map((word) => {
    const otherWords = vocabulary.filter((w) => w.id !== word.id)
    const wrongOptions = shuffleArray(otherWords)
      .slice(0, 3)
      .map((w) => w.meaning)

    const options = shuffleArray([word.meaning, ...wrongOptions])

    return {
      id: word.id,
      word: word.word,
      correctAnswer: word.meaning,
      options: options,
      category: word.category,
      difficulty: word.difficulty,
    }
  })
}