const DAILY_WORD_KEY = 'dailyWord'

// Get today's date as string YYYY-MM-DD
function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

// Get or set daily word
export function getDailyWord(vocabularyList) {
  const stored = JSON.parse(localStorage.getItem(DAILY_WORD_KEY) || 'null')

  // If no stored word or stored date is not today, pick new word
  if (!stored || stored.date !== getTodayString()) {
    const randomWord = vocabularyList[Math.floor(Math.random() * vocabularyList.length)]
    const dailyData = {
      date: getTodayString(),
      wordId: randomWord.id,
    }
    localStorage.setItem(DAILY_WORD_KEY, JSON.stringify(dailyData))
    return randomWord
  }

  // Return stored word
  return vocabularyList.find((w) => w.id === stored.wordId) || vocabularyList[0]
}