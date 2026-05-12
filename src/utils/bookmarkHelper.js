const BOOKMARKS_KEY = 'bookmarkedWords'

// Get all bookmarked word IDs
export function getBookmarks() {
  return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')
}

// Check if a word is bookmarked
export function isBookmarked(wordId) {
  return getBookmarks().includes(wordId)
}

// Toggle bookmark status
export function toggleBookmark(wordId) {
  const bookmarks = getBookmarks()
  let updated

  if (bookmarks.includes(wordId)) {
    updated = bookmarks.filter((id) => id !== wordId)
  } else {
    updated = [...bookmarks, wordId]
  }

  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))
  return updated
}

// Get full word objects for bookmarked IDs
export function getBookmarkedWords(vocabularyList) {
  const bookmarkIds = getBookmarks()
  return vocabularyList.filter((word) => bookmarkIds.includes(word.id))
}